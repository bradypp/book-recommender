<template>
  <div
    class="w-full absolute top-full left-0 min-h-full shadow-md rounded-md overflow-hidden mt-1 border border-grey-500"
  >
    <div v-if="isLoading">loading...</div>
    <div v-else-if="!isLoading && books.length === 0">no books found</div>
    <ul v-else class="h-72 overflow-y-scroll transition-all book-list">
      <SearchDropdownItem
        v-for="book in books"
        :key="book._id"
        :book="book"
        @choose-book="$emit('choose-book', book._id)"
      />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
    books: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
.book-list {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
}
</style>
