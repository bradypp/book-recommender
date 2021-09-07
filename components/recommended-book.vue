<template>
  <li
    class="w-full relative group"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="removeActivePopup"
  >
    <NuxtLink class="h-full w-full" :to="slug">
      <img
        class="shadow-md h-72 mb-3 mx-auto rounded transition-shadow group-hover:shadow-lg"
        :src="coverSrc || require('@/assets/images/default.jpg')"
        :alt="coverAlt"
      />
      <p class="w-full text-sm font-medium mb-2 pr-2">
        {{ fullTitle }}
      </p>
      <p class="w-full text-xs font-light text-gray-400 font-secondary pr-2">
        {{ authorsText }}
      </p>
    </NuxtLink>
    <div
      ref="popup"
      :class="[
        'h-60 w-96 absolute top-0 transition-opacity mx-1 p-2 bg-gray-100 rounded shadow-lg',
        { 'opacity-100 visible z-10': popupIsActive },
        { 'opacity-0 invisible': !popupIsActive },
      ]"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div class="w-full">popup</div>
      <div class="">uo</div>
    </div>
  </li>
</template>

<script>
import { debounce } from 'lodash';
import { getCoverSrc, getFullTitle, getSlug, getAuthorsText, getCoverAlt } from '@/utils/book';

// TODO Add max height to list item and truncate title and/or authors
export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      popupIsActive: false,
      popupEl: null,
      popupDimensions: null,
      popupTimeOutEnterId: null,
      popupTimeOutLeaveId: null,
    };
  },
  computed: {
    coverSrc() {
      return getCoverSrc(this.book);
    },
    coverAlt() {
      return getCoverAlt(this.fullTitle, this.authorsText);
    },
    fullTitle() {
      return getFullTitle(this.book);
    },
    slug() {
      return getSlug(this.book);
    },
    authorsText() {
      return getAuthorsText(this.book);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.popupEl = this.$refs.popup;
      this.popupDimensions = this.popupEl.getBoundingClientRect();
      this.onWindowResize();
      window.addEventListener('resize', debounce(this.onWindowResize, 200));
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', debounce(this.onWindowResize, 200));
  },
  methods: {
    onWindowResize() {
      if (this.popupDimensions.right > window.innerWidth * 0.7) {
        this.popupEl.style.right = '100%';
      } else {
        this.popupEl.style.left = '100%';
      }
    },
    removeActivePopup(e) {
      if (!this.popupEl?.contains(e.target)) {
        this.popupIsActive = false;
      }
    },
    onMouseOver() {
      if (typeof this.popupTimeOutLeaveId === 'number') {
        window.clearTimeout(this.popupTimeOutLeaveId);
      }
      this.popupTimeOutEnterId = setTimeout(() => {
        this.popupIsActive = true;
      }, 200);
    },
    onMouseLeave() {
      if (typeof this.popupTimeOutEnterId === 'number') {
        window.clearTimeout(this.popupTimeOutEnterId);
      }
      this.popupTimeOutLeaveId = setTimeout(() => {
        this.popupIsActive = false;
      }, 250);
    },
  },
};
</script>
