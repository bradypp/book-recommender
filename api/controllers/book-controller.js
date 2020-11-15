import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync, queryStringToFilterObj } from '../utils/helpers';
import QueryHandler from './query-handler';

export const getAllBooks = catchAsync(async (req, res, next) => {
  // TODO instead of sending 'title[regex]' in query, send 'search[regex]' and queries for 'title', 'authors' and 'genres'?
  const handler = new QueryHandler(Book.find(), req.query).filter().sort().limitFields().paginate();

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

export const getRecommendedBooks = catchAsync(async (req, res, next) => {
  const relatedBooksUrls = [req.body.relatedBooksUrls].flat();
  const genres = [req.body.genres].flat();
  const tags = [req.body.tags].flat();
  const seriesNumberRegex =
    req.body.seriesNumber === 'none' ? /.+/ : req.body.seriesNumber === 'first' ? /^[02-9]/ : /\D/;
  const filterObj = {
    ratingCount: {
      $gte: 100,
    },
    ratingValue: {
      $gte: 4,
    },
    seriesNumber: { $not: seriesNumberRegex },
    ...queryStringToFilterObj({ ...req.query }),
  };
  const fields = [
    'goodreadsUrls',
    'goodreadsId',
    'relatedBooksUrls',
    'seriesBooksUrls',
    'genresMatchCount',
    'tagsMatchCount',
    'updatedAt',
    'createdAt',
    'reviewCount',
    'isbn',
    'numberOfPages',
    'bookEdition',
    'bookFormat',
  ];

  const query = Book.aggregate([
    {
      $match: {
        $or: [
          { genres: { $in: genres } },
          { tags: { $in: tags } },
          { goodreadsUrls: { $in: relatedBooksUrls } },
        ],
        ...filterObj,
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
      $unset: [...fields, '__v'],
    },
  ]).allowDiskUse(true);

  const handler = new QueryHandler(query, req.query).sort().paginate();
  const recommendedBooks = await handler.query;

  let relatedBooks;
  if (!recommendedBooks || recommendedBooks.length < 50) {
    const goodreadsUrls = [req.body.goodreadsUrls].flat();
    const handler = new QueryHandler(
      Book.find({
        goodreadsUrls: { $in: relatedBooksUrls },
        relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] },
        ratingCount: {
          $gte: 100,
        },
      }),
      { sort: '-ratingValue', page: 1, limit: 50, fields: fields.map(el => '-' + el) },
    )
      .sort()
      .limitFields()
      .paginate();
    relatedBooks = await handler.query;
  }

  if (!recommendedBooks && !relatedBooks) {
    return next(new AppError('No books found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      recommendedBooks,
      relatedBooks,
    },
  });
});
