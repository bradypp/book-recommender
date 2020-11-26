<template>
  <ul v-if="books.length !== 0" class="grid grid-cols-5 gap-x-8 gap-y-12 auto-cols-fr w-9/12">
    <li v-for="book in books" :key="book.id" class="w-full relative">
      <NuxtLink class="h-full" :to="getSlug(book)">
        <div class="h-60 w-full mb-3 relative">
          <img
            class="shadow-lg h-full rounded mx-auto"
            :src="getCoverSrc(book)"
            :alt="`${book.title} by ${book.authors.join(', ')}`"
          />
          <div
            :class="[
              'opacity-0 h-full w-96 bg-gray-200 rounded absolute top-0 left-full transition-opacity',
              { 'opacity-100': isActive },
            ]"
          >
            popup
          </div>
        </div>
        <p class="w-full text-sm font-medium mb-2">
          {{ getTitle(book) }}
        </p>
        <p class="w-full text-xs font-light text-gray-200 font-secondary">
          {{ getSubtitle(book) }}
        </p>
      </NuxtLink>
    </li>
  </ul>
</template>

<script>
import { kebabCase } from 'lodash';
import { objectToQueryString } from '@/utils/url';

// TODO Extract each book into its own components to make event handling easier for each item. Use refs and computed properties to set active popup using js instead of css hover states.
export default {
  fetchOnServer: false,
  async fetch() {
    const queryString = objectToQueryString(this.$route.query);
    try {
      const res = await this.$nuxt.$axios.$get(
        `http://localhost:3000/api/books/recommended?${queryString}`,
      );
      this.books = res.data.books;
    } catch (err) {
      console.log(err.message);
    }
  },
  data() {
    return { books: [] };
  },
  watch: {
    '$route.query'() {
      if (this.$route.name === 'explore') {
        this.$fetch();
      }
    },
  },
  methods: {
    getCoverSrc(book) {
      return book.coverImage !== 'default.jpg'
        ? book.coverImage
        : require(`~/assets/images/${book.coverImage}`);
    },
    getTitle(book) {
      return book.series
        ? `${book.title} (${book.series}${book.seriesNumber ? ` #${book.seriesNumber}` : ''})`
        : book.title;
    },
    getSubtitle(book) {
      return book.authors.join(', ');
    },
    getSlug(book) {
      return `/book/${book._id}-${kebabCase(book.title)}`;
    },
  },
};
</script>
