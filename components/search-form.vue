<template>
  <form class="w-full" @submit.prevent="submitForm">
    <p>Search</p>
    <input
      :class="searchInputClass"
      type="text"
      name="main-search"
      :value="values.search"
      @:keyup.enter="submitForm"
      @input="onSearchInput"
    />
  </form>
</template>

<script>
import { objectToQueryString } from '@/utils/url';
import { debounce } from 'lodash';

const commonInputClass = 'border border-grey-500 rounded-3xl focus:outline-none px-2';

export default {
  data() {
    return {
      values: {
        search: '',
      },
      searchDropdown: [],
      searchInputClass: [commonInputClass, 'w-1/2 h-12 text-lg'],
    };
  },
  methods: {
    submitForm() {
      this.$router.push({ path: 'explore', query: this.values });
    },
    onSearchInput: debounce(async function (event) {
      this.values.search = event.target.value;

      if (typeof this.onSearchInput.inputCache === 'undefined') {
        this.onSearchInput.inputCache = '';
      }

      // For search dropdown
      if (this.onSearchInput.inputCache !== this.values.search) {
        // TODO: limit fields for what you need
        const queryString = objectToQueryString({
          [`title[regex]`]: this.values.search,
          sort: ['-ratingCount', '-ratingValue'],
          fields: ['title', 'authors', 'coverImage'],
          limit: 20,
        });
        const res = await this.$nuxt.$axios.$get(
          `http://localhost:3000/api/book/all?${queryString}`,
        );
        // TODO: Make more queries here for other filter (e.g. author or genre regex)
        // TODO: Filter out results with same name/isbn
        this.searchDropdown = [...res.data.books];
        this.onSearchInput.inputCache = this.values.search;
      }
    }, 500),
  },
};
</script>
