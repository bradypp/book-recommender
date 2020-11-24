<template>
  <div v-if="books.length !== 0" class="grid grid-cols-5">
    <div v-for="book in books" :key="book.id">{{ book.title }}</div>
  </div>
</template>

<script>
import { objectToQueryString } from '@/utils/url';

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
      console.log(err);
    }
  },
  data() {
    return { books: [] };
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {},
};
</script>
