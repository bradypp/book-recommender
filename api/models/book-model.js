import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  goodreadsUrls: {
    type: [String],
    trim: true,
  },
  goodreadsId: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    default: 'default.jpg',
  },
  title: {
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
  seriesBooksUrls: {
    type: [String],
    trim: true,
  },
  descriptionHTML: {
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
  bookEdition: {
    type: String,
    trim: true,
  },
  editionLanguage: {
    type: String,
    trim: true,
  },
  bookFormat: {
    type: String,
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
});

const Book = model('Book', bookSchema, 'books');

export default Book;
