import { kebabCase } from 'lodash';

const bookMixin = {
  computed: {
    coverSrc() {
      return this.book.coverImage !== 'default.jpg'
        ? this.book.coverImage
        : require('@/assets/images/default.jpg');
    },
    coverAlt() {
      return `${this.fullTitle}${this.authorsText ? ` by ${this.authorsText}` : ''}`;
    },
    fullTitle() {
      return this.book.series
        ? `${this.book.title} (${this.book.series}${
            this.book.seriesNumber ? ` #${this.book.seriesNumber}` : ''
          })`
        : this.book.title;
    },
    slug() {
      return `book/${this.book._id}-${kebabCase(this.book.title)}`;
    },
    authorsText() {
      return this.book.authors.join(', ');
    },
  },
};

export default bookMixin;
