<template>
  <form class="w-1/2 flex justify-center" @submit.prevent="submitForm(searchDropdown[0]._id)">
    <div class="relative w-full">
      <input
        class="border border-grey-500 rounded-full focus:outline-none px-5 w-full h-12 text-lg"
        type="text"
        name="main-search"
        :value="values.search"
        @:keyup.enter="submitForm(searchDropdown[0]._id)"
        @input="onSearchInput"
      />
      <SearchDropdown
        :books="searchDropdown"
        :is-loading="dropdownIsLoading"
        @choose-book="submitForm"
      />
    </div>
  </form>
</template>

<script>
import { debounce } from 'lodash';

// TODO: Allow search by search term or submitting book currently selected from dropdown (by tabbing through and highlighting/focussing)
export default {
  data() {
    return {
      values: {
        search: '',
      },
      searchDropdown: [],
      dropdownIsLoading: false,
    };
  },
  methods: {
    submitForm(id) {
      this.$router.push({ path: 'explore', query: { id } });
    },
    onSearchInput(event) {
      this.showDropdown = true;
      this.values.search = event.target.value;
      this.getSearchDropdownBooks(this.values.search);
    },
    getSearchDropdownBooks: debounce(async function (search) {
      if (typeof this.onSearchInput.inputCache === 'undefined') {
        this.onSearchInput.inputCache = '';
      }

      // For search dropdown
      if (this.onSearchInput.inputCache !== search) {
        this.dropdownIsLoading = true;
        try {
          const res = await this.$nuxt.$axios.$get(
            `http://localhost:3000/api/books/search?search=${search}`,
          );
          this.searchDropdown = [...res.data.books];
          this.dropdownIsLoading = false;
          this.onSearchInput.inputCache = search;
        } catch (err) {
          this.searchDropdown = [];
          this.dropdownIsLoading = false;
          this.onSearchInput.inputCache = '';
        }
      }
    }, 500),
  },
};
</script>
