const { Schema, model } = require('mongoose');

const options = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const bookSchema = new Schema(
  {
    goodreadsUrl: {
      type: String,
      trim: true,
      unique: true,
    },
    coverImage: {
      type: String,
      default: 'default.jpg',
    },
    title: {
      type: String,
      trim: true,
    },
    seriesRaw: {
      type: String,
      trim: true,
    },
    series: {
      type: String,
      trim: true,
    },
    seriesNumber: {
      type: String,
      trim: true,
    },
    booksInSeries: [
      {
        goodreadsUrl: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        seriesNumber: {
          type: String,
          trim: true,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    descriptionHTML: {
      type: String,
      trim: true,
    },
    descriptionHTMLShort: {
      type: String,
      trim: true,
    },
    ratingValue: {
      type: Number,
      trim: true,
    },
    ratingCount: {
      type: Number,
      trim: true,
    },
    reviewCount: {
      type: Number,
      trim: true,
    },
    relatedBooksUrls: {
      type: [String],
      trim: true,
    },
    authors: {
      type: [String],
      trim: true,
    },
    numberOfPages: {
      type: Number,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    genres: {
      type: [String],
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    latestPublished: {
      type: Date,
    },
    latestPublishedFormat: {
      type: String,
    },
    firstPublished: {
      type: Date,
    },
    firstPublishedFormat: {
      type: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  options,
);

// bookSchema.index({ genres: 1 });
// bookSchema.index({ authors: 1 });
// bookSchema.index({ title: 1 });
// bookSchema.index({ goodreadsUrl: 1 });

const Book = model('Book', bookSchema, 'books');

module.exports = Book;
