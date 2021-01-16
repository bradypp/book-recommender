<template>
  <ul v-if="books.length !== 0" class="grid grid-cols-5 gap-x-8 gap-y-12 auto-cols-fr w-9/12">
    <RecommendedBook v-for="book in books" :key="book.id" :book="book" />
  </ul>
</template>

<script>
import { objectToQueryString } from '@/utils/url';
// TODO Make height fit content

export default {
  fetchOnServer: false,
  async fetch() {
    this.books = [];
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
    return {
      books: [],
      page: 1,
      limit: 30,
    };
  },
  watch: {
    '$route.query'() {
      if (this.$route.name === 'recommended') {
        this.$fetch();
      }
    },
  },
};
</script>
