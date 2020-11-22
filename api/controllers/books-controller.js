import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync, getFilterObj, isObject } from '../utils/helpers';
import QueryHandler from './query-handler';

const removeDuplicates = (arr, exclusionsArr) => {
  return arr.filter((el, i, arr) => {
    return (
      i ===
        arr.findIndex(el2 => {
          return el2.title === el.title || el2._id === el._id;
        }) && exclusionsArr.findIndex(el2 => el2.title === el.title || el2._id === el._id) === -1
    );
  });
};

const getBooks = catchAsync(async (req, res, next) => {
  console.log(req.params);

  const { query, excludedFilterFields, isFilterObjPrepared } = req;

  const handler = new QueryHandler(Book.find(), query)
    .filter({ excludedFilterFields, isFilterObjPrepared })
    .sort()
    .limitFields()
    .paginate();

  // const docs = await handler.query.explain();
  const docs = await handler.query;
  if (!docs) {
    return next(new AppError('No books found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      books: docs,
    },
  });
});

const getSearchedForBooks = catchAsync(async (req, res, next) => {
  if (!req.query.search) {
    return next(new AppError('No search term has been entered', 404));
  }

  const searchRegex = new RegExp(req.query.search, 'i');
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const sort = '-ratingCount -ratingValue';
  const select = 'title authors coverImage series seriesNumber';
  const foundBooks = req.body.foundBooks || [];

  const titleDocs =
    (await Book.find({ title: { $regex: searchRegex } })
      .sort(sort)
      .select(select)
      .skip(skip)
      .limit(limit)) || [];
  const seriesDocs =
    (await Book.find({ series: { $in: [searchRegex] } })
      .sort(sort)
      .select(select)
      .skip(skip)
      .limit(limit)) || [];
  const authorsDocs =
    (await Book.find({ authors: { $in: [searchRegex] } })
      .sort(sort)
      .select(select)
      .skip(skip)
      .limit(limit)) || [];

  // const docs =
  //   (await Book.find({ title: { $regex: searchRegex } })
  //     .sort(sort)
  //     .select(select)
  //     .limit(limit)) || [];

  // if (docs.length < limit) {
  //   docs.push(
  //     ...((await Book.find({ series: { $in: [searchRegex] } })
  //       .sort(sort)
  //       .select(select)
  //       .limit(limit - docs.length)) || []),
  //   );
  // }

  // if (docs.length < limit) {
  //   docs.push(
  //     ...((await Book.find({ authors: { $in: [searchRegex] } })
  //       .sort(sort)
  //       .select(select)
  //       .limit(limit - docs.length)) || []),
  //   );
  // }

  const books = removeDuplicates([...titleDocs, ...seriesDocs, ...authorsDocs], foundBooks);

  if (!books || books.length === 0) {
    return next(new AppError('No books found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

const recommendedFields = [
  'title',
  'coverImage',
  'authors',
  'descriptionHTML',
  'ratingValue',
  'ratingCount',
  'series',
  'seriesNumber',
  'latestPublished',
  'firstPublished',
  'latestPublishedFormat',
  'firstPublishedFormat',
];

const getSeriesNumberFilter = seriesNumber => {
  switch (seriesNumber) {
    case 'none':
      return { $not: /.+/ };
    case 'any':
      return { $regex: /.+/ };
    case 'first':
    default:
      return { $not: /^[02-9]/ };
  }
};

// This is for when multiple books are chosen
const getBookDataFromIds = catchAsync(async (req, res, next) => {
  if (!req.bookData && req.query.id) {
    const books = await Book.find({ _id: { $in: [req.query.id].flat() } });
    if (!books) {
      return next(new AppError('No books found', 404));
    }
    req.bookData = books;
  }
  next();
});

const getRecommendedBooks = catchAsync(async (req, res, next) => {
  if (!req.bookData) {
    return next(new AppError('No book id(s) or search term provided', 404));
  }

  // Reduce the array of book objects in req.bookData to a single object
  const bookData = isObject(req.bookData)
    ? req.bookData
    : req.bookData.reduce(
        (acc, el) => ({
          genres: [...new Set([...acc.genres, ...el.genres])],
          tags: [...new Set([...acc.tags, ...el.tags])],
          relatedBooksUrls: [...new Set([...acc.relatedBooksUrls, ...el.relatedBooksUrls])],
          goodreadsUrls: [...new Set([...acc.goodreadsUrls, ...el.goodreadsUrls])],
          authors: [...new Set([...acc.authors, ...el.authors])],
          series: [acc.series, el.series].flat().filter(Boolean),
        }),
        {},
      );

  const {
    seriesNumberType = 'first',
    includeSameAuthors = false,
    includeSameSeries = false,
    ...queryObj
  } = req.query;
  const { genres, tags, relatedBooksUrls, goodreadsUrls, authors, series } = bookData;

  const commonFilters = {
    descriptionHTML: {
      $exists: true,
      $ne: null,
    },
    editionLanguage: 'English',
    ratingCount: {
      $gte: 200,
    },
    ratingValue: {
      $gte: 3.85,
    },
    numberOfPages: {
      $gte: 150,
    },
    series: !includeSameSeries ? { $nin: series } : undefined,
    authors: !includeSameAuthors ? { $nin: authors } : undefined,
    seriesNumber: getSeriesNumberFilter(seriesNumberType),
    ...getFilterObj(
      { ...queryObj },
      {
        excludedFilterFields: ['id', 'seriesNumberType', 'includeSameSeries', 'includeSameAuthors'],
      },
    ),
  };

  const genresBooks =
    (await Book.aggregate([
      {
        $match: {
          $or: [{ genres: { $in: genres } }, { tags: { $in: tags } }],
          ...commonFilters,
        },
      },
      {
        $addFields: {
          genresMatchCount: {
            $size: { $ifNull: [{ $setIntersection: [genres, '$genres'] }, []] },
          },
          tagsMatchCount: {
            $size: { $ifNull: [{ $setIntersection: [tags, '$tags'] }, []] },
          },
        },
      },
      {
        $match: {
          tagsMatchCount: {
            $gte: 3,
          },
        },
      },
      { $sort: { genresMatchCount: -1, ratingCount: -1 } },
      { $limit: 1000 },
    ]).allowDiskUse(true)) || [];

  const relatedBooks =
    (await Book.find({
      $or: [
        { goodreadsUrls: { $in: relatedBooksUrls } },
        { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
      ],
      ...commonFilters,
    })) || [];

  const querySort = queryObj.sort || '-ratingCount';
  const limit = queryObj.limit * 1 || 100;
  const page = queryObj.page * 1 || 1;
  const skip = (page - 1) * limit;

  const books = [...genresBooks, ...relatedBooks]
    .filter(
      (el, i, arr) =>
        el.descriptionHTML &&
        i ===
          arr.findIndex(
            el2 =>
              (el2.title && el.title && new RegExp('^' + el2.title).test(el.title)) ||
              (el2._id && el._id && el2._id === el._id) ||
              (el2.isbn && el.isbn && el2.isbn === el.isbn) ||
              (el2.goodreadsId && el.goodreadsId && el2.goodreadsId === el.goodreadsId),
          ),
    )
    .sort((a, b) => {
      if (querySort.startsWith('-')) {
        const sort = querySort.replace('-', '');
        return b[sort] - a[sort];
      }
      return a[querySort] - b[querySort];
    })
    .slice(skip, limit * page)
    .map(el => {
      return recommendedFields.reduce((acc, el2) => {
        acc[el2] = el[el2];
        return acc;
      }, {});
    });

  if (!books) {
    return next(new AppError('No books found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

const prepareRelatedBooksSearch = (req, res, next) => {
  const { relatedBooksUrls, goodreadsUrls } = req.bookData;
  const { seriesNumberType, ...queryObj } = req.query;

  req.query = {
    fields: recommendedFields,
    ...req.query,
    ratingValue: {
      $gte: 4,
    },
    ...getFilterObj({ ...queryObj }, { excludedFilterFields: ['id', 'seriesNumberType'] }),
    seriesNumber: getSeriesNumberFilter(seriesNumberType),
    $or: [
      { goodreadsUrls: { $in: relatedBooksUrls } },
      { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
    ],
  };

  req.isFilterObjPrepared = true;
  next();
};

export default {
  getBooks,
  getBookDataFromIds,
  getSearchedForBooks,
  getRecommendedBooks,
  prepareRelatedBooksSearch,
};
