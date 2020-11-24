<template>
  <div v-if="books.length > 0" class="w-full absolute top-full left-0">
    <div v-if="isLoading">loading...</div>
    <ul v-else>
      <li v-for="book in books" :key="book._id" @click="$emit('choose-book', book._id)">
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
      default: true,
    },
    books: {
      type: Array,
      required: true,
    },
  },
};
</script>
