import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync, getFilterObj } from '../utils/helpers';
import QueryHandler from './query-handler';

export const getAllBooks = catchAsync(async (req, res, next) => {
  const handler = new QueryHandler(Book.find(), req.query)
    .filter(req.excludedFilterFields, req.isFilterObjPrepared)
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

// TODO test the difference in results once the frontend is built out
// export const prepareBookSearch = (req, res, next) => {
//   if (!req.query.search) {
//     return next(new AppError('No search term has been entered', 404));
//   }

//   const searchRegex = new RegExp(req.query.search, 'i');

//   req.query = {
//     ratingCount: {
//       $gte: 100,
//     },
//     sort: ['-ratingCount', '-ratingValue'],
//     $or: [
//       { title: { $regex: searchRegex } },
//       { authors: { $in: [searchRegex] } },
//       { series: { $in: [searchRegex] } },
//     ],
//     limit: 20,
//     fields: ['title', 'author', 'seriesName', 'seriesNumber', 'coverImage']
//   };
//   req.isFilterObjPrepared = true;

//   next();

// };

export const getSearchedForBooks = catchAsync(async (req, res, next) => {
  if (!req.query.search) {
    return next(new AppError('No search term has been entered', 404));
  }

  const searchRegex = new RegExp(req.query.search, 'i');

  const commonFilters = {
    ratingCount: {
      $gte: 100,
    },
  };

  const commonSort = {
    $sort: {
      ratingCount: -1,
      ratingValue: -1,
    },
  };

  const query = Book.aggregate([
    {
      $facet: {
        authors: [
          {
            $match: {
              authors: { $in: [searchRegex] },
              ...commonFilters,
            },
          },
          commonSort,
          { $limit: 4 },
        ],
        title: [
          {
            $match: {
              title: { $regex: searchRegex },
              ...commonFilters,
            },
          },
          commonSort,
          { $limit: 12 },
        ],
        series: [
          {
            $match: {
              series: { $in: [searchRegex] },
              ...commonFilters,
            },
          },
          commonSort,
          { $limit: 4 },
        ],
      },
    },
    commonSort,
    { $limit: 10 },
  ]).allowDiskUse(true);

  const handler = new QueryHandler(query, req.query).sort().paginate();
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

const recommendedFields = {
  title: 1,
  coverImage: 1,
  authors: 1,
  descriptionHTML: 1,
  ratingValue: 1,
  ratingCount: 1,
  series: 1,
  seriesNumber: 1,
  latestPublished: 1,
  firstPublished: 1,
  latestPublishedFormat: 1,
  firstPublishedFormat: 1,
};

const getSeriesNumberFilter = seriesNumber => {
  switch (seriesNumber) {
    case 'none':
      return { $not: /.+/ };
    case 'first':
      return { $not: /^[02-9]/ };
    case 'any':
    default:
      return { $regex: /.+/ };
  }
};

export const getRecommendedBooks = catchAsync(async (req, res, next) => {
  const genres = [req.body.genres].flat();
  const tags = [req.body.tags].flat();

  const query = Book.aggregate([
    {
      $match: {
        $or: [{ genres: { $in: genres } }, { tags: { $in: tags } }],
        ratingCount: {
          $gte: 1000,
        },
        ratingValue: {
          $gte: 4,
        },
        seriesNumber: getSeriesNumberFilter(req.body.seriesNumber),
        ...getFilterObj({ ...req.query }),
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
    { $sort: { genresMatchCount: -1, tagsMatchCount: -1, ratingValue: -1 } },
    { $limit: 2000 },
    {
      $project: recommendedFields,
    },
  ]).allowDiskUse(true);

  const handler = new QueryHandler(query, req.query).sort().paginate();
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

// TODO test the difference in results once the frontend is built out
// export const getRecommendedBooks = catchAsync(async (req, res, next) => {
//   const genres = [req.body.genres].flat();
//   const tags = [req.body.tags].flat();
//   const relatedBooksUrls = [req.body.relatedBooksUrls].flat();
//   const goodreadsUrls = [req.body.goodreadsUrls].flat();
//   const authors = [req.body.authors].flat();

//   const commonFilters = {
//     ratingCount: {
//       $gte: 1000,
//     },
//     ratingValue: {
//       $gte: 4,
//     },
//     seriesNumber: getSeriesNumberFilter(req.body.seriesNumber),
//     ...getFilterObj({ ...req.query }),
//   };

//   const query = Book.aggregate([
//     {
//       $facet: {
//         genres: [
//           {
//             $match: {
//               $or: [{ genres: { $in: genres } }, { tags: { $in: tags } }],
//               ...commonFilters,
//             },
//           },
//           {
//             $addFields: {
//               genresMatchCount: {
//                 $size: { $ifNull: [{ $setIntersection: [genres, '$genres'] }, []] },
//               },
//               tagsMatchCount: {
//                 $size: { $ifNull: [{ $setIntersection: [tags, '$tags'] }, []] },
//               },
//             },
//           },
//           { $sort: { genresMatchCount: -1, tagsMatchCount: -1, ratingValue: -1 } },
//           { $limit: 2000 },
//         ],
//         related: [
//           {
//             $match: {
//               $or: [
//                 { goodreadsUrls: { $in: relatedBooksUrls } },
//                 { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
//               ],
//               ...commonFilters,
//             },
//           },
//         ],
//         authors: [
//           {
//             $match: {
//               $or: [{ authors: { $in: authors } }],
//               ...commonFilters,
//             },
//           },
//         ],
//       },
//     },
//     { $project: { books: { $setUnion: ['$genres', '$related', '$authors'] } } },
//     { $unwind: '$books' },
//     { $replaceRoot: { newRoot: '$books' } },
//     {
//       $project: recommendedFields,
//     },
//   ]).allowDiskUse(true);

//   const handler = new QueryHandler(query, req.query).sort();
//   const docs = await handler.query;
//   if (!docs) {
//     return next(new AppError('No books found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     results: docs.length,
//     data: {
//       books: docs,
//     },
//   });
// });

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
