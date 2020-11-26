<template>
  <div class="w-full absolute top-full left-0 min-h-full">
    <div v-if="isLoading">lodaing...</div>
    <div v-else-if="!isLoading && books.length === 0">no books found</div>
    <ul v-else>
      <li
        v-for="book in books"
        :key="book._id"
        class="w-full h-8 cursor-pointer"
        @click="$emit('choose-book', book._id)"
      >
        {{ book.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    books: {
      type: Array,
      required: true,
    },
  },
};
</script>
