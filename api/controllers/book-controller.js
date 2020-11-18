import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync, getFilterObj } from '../utils/helpers';
import QueryHandler from './query-handler';

export const getAllBooks = catchAsync(async (req, res, next) => {
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

export const getSearchedForBooks = catchAsync(async (req, res, next) => {
  if (!req.query.search) {
    return next(new AppError('No search term has been entered', 404));
  }

  const searchRegex = new RegExp(req.query.search, 'i');

  const sort = '-ratingCount -ratingValue';
  const select = 'title';

  const titleDocs = await Book.find({ title: { $regex: searchRegex } })
    .sort(sort)
    .select(select)
    .limit(6);
  const seriesDocs = await Book.find({ series: { $in: [searchRegex] } })
    .sort(sort)
    .select(select)
    .limit(3);
  const authorsDocs = await Book.find({ authors: { $in: [searchRegex] } })
    .sort(sort)
    .select(select)
    .limit(3);

  // Remove duplicates
  const docs = [...titleDocs, ...seriesDocs, ...authorsDocs].filter(
    (el, i, arr) => i === arr.findIndex(el2 => el2.title === el.title || el2._id === el._id),
  );

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

// TODO Exclude results from same author or series? Make it an option?
// TODO Add filters for language?
// TODO Remove tags from filter? (test)

export const getRecommendedBooks = catchAsync(async (req, res, next) => {
  const genres = [req.body.genres].flat();
  const tags = [req.body.tags].flat();
  const relatedBooksUrls = [req.body.relatedBooksUrls].flat();
  const goodreadsUrls = [req.body.goodreadsUrls].flat();
  const authorsToExclude = [req.body.authorsToExclude].flat();

  const commonFilters = {
    ratingCount: {
      $gte: 200,
    },
    ratingValue: {
      $gte: 3.85,
    },
    numberOfPages: {
      $gte: 150,
    },
    authors: { $nin: authorsToExclude },
    seriesNumber: getSeriesNumberFilter(req.body.seriesNumber),
    ...getFilterObj({ ...req.query }),
  };

  const genresBooks = await Book.aggregate([
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
  ]).allowDiskUse(true);

  const relatedBooks = await Book.find({
    $or: [
      { goodreadsUrls: { $in: relatedBooksUrls } },
      { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
    ],
    ...commonFilters,
  });

  const querySort = req.query.sort || 'ratingValue';
  const limit = req.query.limit * 1 || 100;
  const page = req.query.page * 1 || 1;
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

export const prepareRelatedBooksSearch = (req, res, next) => {
  const relatedBooksUrls = [req.body.relatedBooksUrls].flat();
  const goodreadsUrls = [req.body.goodreadsUrls].flat();

  req.query = {
    fields: recommendedFields,
    ...req.query,
    ratingValue: {
      $gte: 4,
    },
    ...getFilterObj({ ...req.query }),
    seriesNumber: getSeriesNumberFilter(req.query.seriesNumber),
    $or: [
      { goodreadsUrls: { $in: relatedBooksUrls } },
      { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
    ],
  };

  req.isFilterObjPrepared = true;
  next();
};
