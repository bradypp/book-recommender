<template>
  <li class="w-full relative group" @mouseover="isActive = true" @mouseleave="isActive = false">
    <NuxtLink class="h-full" :to="getSlug(book)">
      <div class="h-60 w-full mb-3 relative">
        <img
          class="shadow-lg h-full rounded mx-auto transition-shadow group-hover:shadow-xl"
          :src="getCoverSrc(book)"
          :alt="`${book.title} by ${book.authors.join(', ')}`"
        />
        <div
          ref="popup"
          :class="[
            'h-full w-96 absolute top-0 transition-opacity px-1',
            { 'opacity-100 visible z-10': isActive },
            { 'opacity-0 invisible': !isActive },
          ]"
        >
          <div class="h-full w-full bg-gray-100 rounded">popup</div>
        </div>
      </div>
      <p class="w-full text-sm font-medium mb-2">
        {{ getTitle(book) }}
      </p>
      <p class="w-full text-xs font-light text-gray-400 font-secondary">
        {{ getSubtitle(book) }}
      </p>
    </NuxtLink>
  </li>
</template>

<script>
import { kebabCase } from 'lodash';

export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const popupEl = this.$refs.popup;
      const popupDimensions = popupEl.getBoundingClientRect();
      const onWindowResize = () => {
        if (popupDimensions.right > window.innerWidth * 0.65) {
          popupEl.style.right = '100%';
        } else {
          popupEl.style.left = '100%';
        }
        console.log(popupEl.classList);
      };
      onWindowResize();
      window.onresize = onWindowResize;
    });
  },
  methods: {
    getCoverSrc(book) {
      return book.coverImage !== 'default.jpg'
        ? book.coverImage
        : require(`~/assets/images/${book.coverImage}`);
    },
    getTitle(book) {
      return book.series
        ? `${book.title} (${book.series}${book.seriesNumber ? ` #${book.seriesNumber}` : ''})`
        : book.title;
    },
    getSubtitle(book) {
      return book.authors.join(', ');
    },
    getSlug(book) {
      return `/book/${book._id}-${kebabCase(book.title)}`;
    },
  },
};
</script>

<style lang="postcss" scoped>
@keyframes mymove {
  from {
    top: 0px;
  }
  to {
    top: 200px;
  }
}
</style>
