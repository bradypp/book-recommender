<template>
  <li
    class="w-full h-16 cursor-pointer overflow-hidden transition-colors bg-white hover:bg-gray-200 px-4 py-1 flex"
    @click="$emit('choose-book')"
  >
    <img
      class="inline-block w-16 object-cover object-top mr-4"
      :src="coverSrc || require('@/assets/images/default.jpg')"
      :alt="coverAlt"
    />
    <div>
      <p class="truncate text-sm font-medium mb-2">
        {{ fullTitle }}
      </p>
      <p class="truncate text-sm font-light text-gray-400 font-secondary">
        {{ `by ${authorsText}` }}
      </p>
    </div>
  </li>
</template>

<script>
import bookMixin from '@/mixins/book-mixin';

export default {
  mixins: [bookMixin],
  props: {
    book: {
      type: Object,
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
