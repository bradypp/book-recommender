import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync, getFilterObj } from '../utils/helpers';
import QueryHandler from './query-handler';

const removeDuplicates = (arr, exclusionsArr = []) => {
  return arr.filter((el, i, arr) => {
    return (
      i ===
        arr.findIndex(el2 => {
          return (
            (el2.title && el.title && el2.title.startsWith(el.title)) ||
            (el2._id && el._id && el2._id === el._id) ||
            (el2.isbn && el.isbn && el2.isbn === el.isbn) ||
            (el2.goodreadsId && el.goodreadsId && el2.goodreadsId === el.goodreadsId)
          );
        }) &&
      exclusionsArr.findIndex(
        el2 =>
          (el2.title && el.title && el2.title.startsWith(el.title)) ||
          (el2._id && el._id && el2._id === el._id) ||
          (el2.isbn && el.isbn && el2.isbn === el.isbn) ||
          (el2.goodreadsId && el.goodreadsId && el2.goodreadsId === el.goodreadsId),
      ) === -1
    );
  });
};

const getBooks = catchAsync(async (req, res, next) => {
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
  const limit = req.query.limit * 1 || 15;
  // const page = req.query.page * 1 || 1;
  // const skip = (page - 1) * limit;
  const sort = '-ratingCount';
  const searchedForFields = req.query.fields || [
    '_id',
    'title',
    'authors',
    'coverImage',
    'series',
    'seriesNumber',
  ];
  const foundBooks = req.body.foundBooks || [];

  // const docs =
  //   (await Book.find({ title: { $regex: searchRegex } })
  //     .sort(sort)
  //     .select(select)
  //     .skip(skip)
  //     .limit(limit)) || [];

  // docs.push(
  //   ...((await Book.find({ series: { $in: [searchRegex] } })
  //     .sort(sort)
  //     .select(select)
  //     .skip(skip)
  //     .limit(limit)) || []),
  // );

  // docs.push(
  //   ...((await Book.find({ authors: { $in: [searchRegex] } })
  //     .sort(sort)
  //     .select(select)
  //     .skip(skip)
  //     .limit(limit)) || []),
  // );

  const docs =
    (await Book.find({ title: { $regex: searchRegex } })
      .sort(sort)
      .limit(limit)) || [];

  if (docs.length < limit) {
    docs.push(
      ...((await Book.find({ series: { $in: [searchRegex] } })
        .sort(sort)
        .limit(limit - docs.length)) || []),
    );
  }

  if (docs.length < limit) {
    docs.push(
      ...((await Book.find({ authors: { $in: [searchRegex] } })
        .sort(sort)
        .limit(limit - docs.length)) || []),
    );
  }

  const filteredBooks = removeDuplicates(docs, foundBooks);

  const books = filteredBooks
    .sort((a, b) => {
      if (sort.startsWith('-')) {
        const newSort = sort.replace('-', '');
        return b[newSort] - a[newSort];
      }
      return a[sort] - b[sort];
    })
    .map(el => {
      return searchedForFields.reduce((acc, el2) => {
        acc[el2] = el[el2];
        return acc;
      }, {});
    });

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
  '_id',
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
      return { series: null, seriesNumber: null };
    case 'first or none':
      return { $or: [{ seriesNumber: { $not: /^(?!(?:1)$)\d+/ } }, { seriesNumber: null }] };
    case 'first':
      return { seriesNumber: { $not: /^(?!(?:1)$)\d+/ } };
    case 'any':
    default:
      return { $or: [{ seriesNumber: { $regex: /.+/ } }, { seriesNumber: null }] };
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
  const bookData = req.bookData.reduce(
    (acc, el) => ({
      genres: [...new Set([...acc.genres, ...el.genres])],
      tags: [...new Set([...acc.tags, ...el.tags])],
      relatedBooksUrls: [...new Set([...acc.relatedBooksUrls, ...el.relatedBooksUrls])],
      goodreadsUrls: [...new Set([...acc.goodreadsUrls, ...el.goodreadsUrls])],
      authors: [...new Set([...acc.authors, ...el.authors])],
      series: [acc.series, el.series].flat().filter(Boolean),
    }),
    {
      genres: [],
      tags: [],
      relatedBooksUrls: [],
      goodreadsUrls: [],
      authors: [],
      series: null,
    },
  );

  const {
    seriesNumberType = 'any',
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
      $gte: 150,
    },
    ratingValue: {
      $gte: 4,
    },
    numberOfPages: {
      $gte: 120,
    },
    series: !includeSameSeries && series ? { $nin: series } : undefined,
    authors: !includeSameAuthors && authors ? { $nin: authors } : undefined,
    ...getSeriesNumberFilter(seriesNumberType),
    ...getFilterObj(
      { ...queryObj },
      {
        excludedFilterFields: ['id', 'seriesNumberType', 'includeSameSeries', 'includeSameAuthors'],
      },
    ),
  };

  const genresLength = genres.length;
  const tagsLength = tags.length;

  const topGenres =
    genresLength < 5
      ? genres
      : genresLength < 8 || genresLength > 4
      ? genres.slice(0, Math.floor(genresLength * 0.8))
      : genres.slice(0, Math.floor(genresLength * 0.66));
  const topTags =
    tagsLength < 5
      ? tags
      : tagsLength < 11 || tagsLength > 4
      ? tags.slice(0, Math.floor(tagsLength * 0.8))
      : tags.slice(0, Math.floor(tagsLength * 0.66));

  const genresMatchFilterNumber = Math.floor(topGenres.length * 0.8);
  const tagsMatchFilterNumber = Math.floor(topTags.length * 0.5);

  // TODO Make it possible to query with looser restrictions if no results are found. Could put the percentages in the query string so can directly modify from the frontend depending on number of results. When the percentages are changed to increase results, reset page to 1 and filter out the duplicates saved in the front end store.
  const genresBooks =
    (await Book.aggregate([
      {
        $match: {
          $or: [{ genres: { $in: topGenres } }, { tags: { $in: topTags } }],
          ...commonFilters,
        },
      },
      {
        $addFields: {
          topGenres: {
            $slice: ['$genres', 0, 8],
          },
          topTags: {
            $slice: ['$tags', 0, 10],
          },
        },
      },
      {
        $addFields: {
          genresMatchCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [topGenres, '$topGenres'],
                },
                [],
              ],
            },
          },
          tagsMatchCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [topTags, '$topTags'],
                },
                [],
              ],
            },
          },
        },
      },
      {
        $match: {
          genresMatchCount: {
            $gte: genresMatchFilterNumber,
          },
          tagsMatchCount: {
            $gte: tagsMatchFilterNumber,
          },
        },
      },
      { $sort: { genresMatchCount: -1, ratingCount: -1 } },
      { $limit: 1000 },
    ]).allowDiskUse(true)) || [];

  const relatedBooks =
    (await Book.aggregate([
      {
        $match: {
          $or: [
            { goodreadsUrls: { $in: relatedBooksUrls } },
            { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
          ],
          ...commonFilters,
        },
      },
      {
        $addFields: {
          topGenres: {
            $slice: ['$genres', 0, 8],
          },
          topTags: {
            $slice: ['$tags', 0, 10],
          },
        },
      },
      {
        $addFields: {
          genresMatchCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [topGenres, '$topGenres'],
                },
                [],
              ],
            },
          },
          tagsMatchCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [topTags, '$topTags'],
                },
                [],
              ],
            },
          },
        },
      },
      {
        $match: {
          genresMatchCount: {
            $gte: genresMatchFilterNumber,
          },
          tagsMatchCount: {
            $gte: tagsMatchFilterNumber,
          },
        },
      },
    ])) || [];

  const querySort = queryObj.sort || '-ratingCount';
  const limit = queryObj.limit * 1 || 100;
  const page = queryObj.page * 1 || 1;
  const skip = (page - 1) * limit;

  const books = removeDuplicates([...genresBooks, ...relatedBooks])
    .filter(el => !!el.descriptionHTML)
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