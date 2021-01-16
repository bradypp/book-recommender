<template>
  <li class="w-full relative group" @mouseover="isActive = true" @mouseleave="isActive = false">
    <NuxtLink class="h-full" :to="slug">
      <div class="h-60 w-full mb-3 relative">
        <img
          class="shadow-lg h-full rounded mx-auto transition-shadow group-hover:shadow-xl"
          :src="coverSrc || require('@/assets/images/default.jpg')"
          :alt="coverAlt"
        />
      </div>
      <p class="w-full text-sm font-medium mb-2">
        {{ fullTitle }}
      </p>
      <p class="w-full text-xs font-light text-gray-400 font-secondary">
        {{ authorsText }}
      </p>
    </NuxtLink>
    <div
      ref="popup"
      :class="[
        'h-60 w-96 absolute top-0 transition-opacity px-1',
        { 'opacity-100 visible z-10': isActive },
        { 'opacity-0 invisible': !isActive },
      ]"
    >
      <div class="h-full w-full bg-gray-100 rounded">popup</div>
    </div>
  </li>
</template>

<script>
import bookMixin from '@/mixins/book-mixin';
// TODO Add max height to list item and truncate title and/or authors
export default {
  mixins: [bookMixin],
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
      this.popupEl = this.$refs.popup;
      this.popupDimensions = this.popupEl.getBoundingClientRect();
      this.onWindowResize();
      window.addEventListener('resize', this.onWindowResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize() {
      if (this.popupDimensions.right > window.innerWidth * 0.7) {
        this.popupEl.style.right = '100%';
      } else {
        this.popupEl.style.left = '100%';
      }
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
