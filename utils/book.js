import { kebabCase } from 'lodash';

export const getCoverSrc = book => {
  return book.coverImage && book.coverImage !== 'default.jpg'
    ? book.coverImage
    : require('@/assets/images/default.jpg');
};

export const getFullTitle = book => {
  return book.series
    ? `${book.title} (${book.series}${book.seriesNumber ? ` #${book.seriesNumber}` : ''})`
    : book.title;
};

export const getSlug = book => {
  return `book/${book._id}-${kebabCase(book.title)}`;
};

export const getAuthorsText = book => {
  return book.authors?.length !== 0 && book.authors.join(', ');
};

export const getCoverAlt = (title, authors) => {
  return `${title}${authors && ` by ${authors}`}`;
};
