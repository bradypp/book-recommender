<template>
  <div class="">
    <form class="form" @submit.prevent="submitForm">
      <p>Search</p>
      <input
        class="w-40 h-8"
        type="text"
        name="main-search"
        :value="mainSearch"
        @input="onSearchInput"
      />
    </form>
    <div v-for="book in searchDropdown" :key="book.id">
      <img :src="book.coverImage" alt="..." />
    </div>
  </div>
</template>

<script>
import { objectToQueryString } from '@/utils/url';
import { debounce } from 'lodash';

export default {
  data() {
    return {
      mainSearch: '',
      searchDropdown: [],
    };
  },
  methods: {
    submitForm() {
      // Push form values to '/explore' route as query string
    },
    onSearchInput: debounce(async function (event) {
      this.mainSearch = event.target.value;

      if (typeof this.onSearchInput.inputCache === 'undefined') {
        this.onSearchInput.inputCache = '';
      }

      if (this.onSearchInput.inputCache !== this.mainSearch) {
        // TODO: limit fields for what you need
        const queryString = objectToQueryString({
          [`title[regex]`]: this.mainSearch,
          sort: ['-ratingCount', '-ratingValue'],
          fields: ['title', 'authors', 'coverImage'],
          limit: 20,
        });
        const res = await this.$nuxt.$axios.$get(
          `http://localhost:3000/api/book/all?${queryString}`,
        );
        // TODO: filter out results with same name/isbn & keep the one with the shorter goodreadsUrl
        this.searchDropdown = [...res.data.books];
        this.onSearchInput.inputCache = this.mainSearch;
      }
    }, 500),
  },
};
</script>
