<template>
  <div>
    <!-- TODO: update loading -->
    <div v-if="books.length === 0 || isLoading">loading...</div>
    <ul v-else class="grid grid-cols-6 gap-x-5 gap-y-12 auto-cols-fr w-full">
      <RecommendedBook v-for="book in books" :key="book.id" :book="book" />
    </ul>
  </div>
</template>

<script>
import { objectToQueryString } from '@/utils/url';
// Add text saying what tihs recommendation is based off

export default {
  data() {
    return {
      books: [],
      searchedForBookId: '',
      isLoading: true,
    };
  },
  watch: {
    '$route.query'() {
      if (this.$route.name === 'recommended' && this.$route.query.id !== this.searchedForBookId) {
        this.fetchData();
      }
    },
  },
  mounted() {
    if (this.$route.query.id !== this.searchedForBookId) this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      this.books = [];
      this.searchedForBookId = this.$route.query.id;
      const queryString = objectToQueryString({
        id: this.$route.query.id,
        page: this.$route.query.page || 1,
        limit: this.$route.query.limit || 30,
      });
      try {
        const res = await this.$nuxt.$axios.$get(
          `http://localhost:3000/api/books/recommended?${queryString}`,
        );
        // if res.data.books = [] or $fetchState.error, widen search parameters
        this.books = res.data.books;
      } catch (err) {
        console.error(err.message);
      }
      this.isLoading = false;
    },
  },
};
</script>
