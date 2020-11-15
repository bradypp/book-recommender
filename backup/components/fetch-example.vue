<template>
  <div>
    <loading-spinner v-if="$fetchState.pending" />
    <div v-else-if="books">
      <img v-for="book in books" :key="book.id" :src="book.coverImage" class="w-1/4 inline-block" />
    </div>
  </div>
</template>

<script>
import { objectToQueryString } from '@/utils/url';

export default {
  fetchOnServer: false,
  async fetch() {
    const queryString = objectToQueryString(this.$route.query);
    const res = await this.$nuxt.$axios.$get(`http://localhost:3000/api/book/all?${queryString}`);
    // const res = await this.$nuxt.$axios.$get(
    //   `http://localhost:3000/api/book/all${this.$route.fullPath}`,
    // );
    this.books = res.data.books;
  },
  data() {
    return {
      books: [],
    };
  },
};
</script>
