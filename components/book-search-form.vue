<template>
  <form class="relative w-1/2" @submit.prevent="() => {}">
    <InputDropdown
      :options="books"
      :is-loading="isDropdownLoading"
      :input-value="values.search"
      is-book-dropdown
      with-search-icon
      with-delete-icon
      size="large"
      show-dropdown-with-input-only
      @input="onSearchInput"
      @select-option="submitForm"
      @clear-value="clearSearchValue"
    />
    <SelectDropdown
      :value="values.genre"
      :options="genres.map(el => ({ label: el, value: el }))"
      is-multi
      no-options-message="No more genre options"
      @select-option="value => (values.genre = value)"
    />
  </form>
</template>

<script>
import { debounce } from 'lodash';
export default {
  data() {
    return {
      values: {
        search: '',
        genre: [],
      },
      books: [],
      genres: [],
      isDropdownLoading: false,
      requestSource: null,
    };
  },
  async mounted() {
    try {
      const res = await this.$nuxt.$axios.$get(`http://localhost:3000/api/books/genres`);
      this.genres = res.data.genres;
    } catch (error) {}
  },
  methods: {
    submitForm(id) {
      this.$router.push({ path: 'recommended', query: { id } });
    },
    onSearchInput(value) {
      this.isDropdownLoading = true;
      this.values.search = value;
      this.getSearchDropdownBooks(this.values.search);
    },
    clearSearchValue() {
      this.values.search = '';
      this.books = [];
      this.requestSource.cancel();
    },
    getSearchDropdownBooks: debounce(async function (search) {
      if (typeof this.onSearchInput.inputCache === 'undefined') {
        this.onSearchInput.inputCache = '';
      }

      // For search dropdown
      if (this.onSearchInput.inputCache !== search) {
        try {
          const requestSource = this.$axios.CancelToken.source();
          this.requestSource = requestSource;
          const res = await this.$nuxt.$axios.$get(
            `http://localhost:3000/api/books/search?search=${search}`,
            { cancelToken: requestSource.token },
          );
          this.books = [...res.data.books];
          this.isDropdownLoading = false;
          this.onSearchInput.inputCache = search;
        } catch (err) {
          this.books = [];
          this.isDropdownLoading = false;
          this.onSearchInput.inputCache = '';
          console.log('Request canceled', err);
        }
      }
    }, 500),
  },
};
</script>
