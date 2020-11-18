/* eslint-disable no-undef */
export const getRecommendedBooks = catchAsync(async (req, res, next) => {
  const genres = [req.body.genres].flat();
  const tags = [req.body.tags].flat();
  const authorsToExclude = [req.body.authorsToExclude].flat();

  const query = Book.aggregate([
    {
      $match: {
        $or: [{ genres: { $in: genres } }, { tags: { $in: tags } }],
        ratingCount: {
          $gte: 200,
        },
        ratingValue: {
          $gte: 4,
        },
        numberOfPages: {
          $gte: 150,
        },
        authors: { $nin: authorsToExclude },
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
    {
      $match: {
        tagsMatchCount: {
          $gte: 3,
        },
      },
    },
    { $sort: { genresMatchCount: -1, ratingCount: -1 } },
    { $limit: 1000 },
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

export const getRecommendedBooks2 = catchAsync(async (req, res, next) => {
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

  // const projectFields = {
  //   $project: recommendedFields,
  // };

  const docs = await Book.aggregate([
    {
      $facet: {
        genres: [
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
        ],
        related: [
          {
            $match: {
              $and: [
                { $or: [{ genres: { $in: genres } }, { tags: { $in: tags } }] },
                {
                  $or: [
                    { goodreadsUrls: { $in: relatedBooksUrls } },
                    { relatedBooksUrls: { $in: [...goodreadsUrls, ...relatedBooksUrls] } },
                  ],
                },
              ],
              ...commonFilters,
            },
          },
          { $sort: { ratingCount: -1 } },
        ],
      },
    },
    // { $project: { books: { $setUnion: ['$genres', '$related'] } } },
    // { $unwind: '$books' },
    // { $replaceRoot: { newRoot: '$books' } },
    // {
    //   $project: recommendedFields,
    // },
  ]).allowDiskUse(true);

  // const handler = new QueryHandler(query, req.query);
  // const docs = await handler.query;
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
