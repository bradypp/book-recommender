<template>
  <form class="w-1/2 flex justify-center" @submit.prevent="submitForm(searchDropdown[0]._id)">
    <div class="relative w-full">
      <input
        ref="input"
        class="border border-grey-500 rounded-md focus:outline-none px-3 w-full h-12 text-lg"
        type="text"
        name="main-search"
        :value="values.search"
        @:keyup.enter="submitForm(searchDropdown[0]._id)"
        @input="onSearchInput"
        @click="isDropdownActivated = true"
      />
      <SearchDropdown
        v-if="isDropdownActivated && values.search"
        ref="dropdown"
        :books="searchDropdown"
        :is-loading="dropdownIsLoading"
        @choose-book="submitForm"
      />
    </div>
  </form>
</template>

<script>
import { debounce } from 'lodash';
// TODO Move input & it's dropdown into it's own component (create a select component?) so that the events are scoped to each component
// TODO: Allow search by search term or submitting book currently selected from dropdown (by tabbing through and highlighting/focussing)
export default {
  data() {
    return {
      values: {
        search: '',
      },
      searchDropdown: [],
      dropdownIsLoading: false,
      targetElement: {},
      isDropdownActivated: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.addEventListener('mousedown', this.handleMouseDown);
      document.addEventListener('mouseup', this.handleMouseUp);
    });
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },
  methods: {
    submitForm(id) {
      this.$router.push({ path: 'recommended', query: { id } });
    },
    onSearchInput(event) {
      this.dropdownIsLoading = true;
      this.values.search = event.target.value;
      this.getSearchDropdownBooks(this.values.search);
    },
    getSearchDropdownBooks: debounce(async function (search) {
      if (typeof this.onSearchInput.inputCache === 'undefined') {
        this.onSearchInput.inputCache = '';
      }
      console.log({ cache: this.onSearchInput.inputCache, search });
      // For search dropdown
      if (this.onSearchInput.inputCache !== search) {
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
    handleMouseDown(event) {
      this.targetElement = event.target;
    },
    handleMouseUp(event) {
      const ignoredElements = [this.$refs.input, this.$refs.dropdown?.$el];
      if (ignoredElements.length !== 0) {
        const isAnyIgnoredElementAncestorOfTarget = ignoredElements.some(
          el => el && (el.contains(this.targetElement) || el.contains(event.target)),
        );

        if (event.button === 0 && !isAnyIgnoredElementAncestorOfTarget) {
          this.isDropdownActivated = false;
        }
      }
    },
  },
};
</script>
