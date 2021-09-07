<template>
  <li
    :class="listItemClass"
    :data-select-option-value="isBookDropdown ? option._id : option.value"
    @mouseenter="$emit('mouseenter', $event)"
    @click="$emit('select-option', isBookDropdown ? option._id : option.value)"
  >
    <div v-if="isBookDropdown" class="w-full h-16 flex">
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
    </div>
    <span v-else :class="textClass">
      {{ option.label }}
    </span>
  </li>
</template>

<script>
import { getCoverSrc, getFullTitle, getSlug, getAuthorsText, getCoverAlt } from '@/utils/book';

export default {
  props: {
    option: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'medium',
    },
    isBookDropdown: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    listItemClass() {
      return [
        'w-full cursor-pointer overflow-hidden transition-colors bg-white px-4 py-1 flex items-center',
        { 'h-8': !this.isBookDropdown && this.size === 'small' },
        { 'h-10': !this.isBookDropdown && this.size === 'medium' },
        { 'h-12': !this.isBookDropdown && this.size === 'large' },
      ];
    },
    textClass() {
      return [
        'truncate font-secondary capitalize',
        { 'text-sm': this.size === 'small' },
        { 'text-md': this.size === 'medium' },
        { 'text-lg': this.size === 'large' },
      ];
    },

    coverSrc() {
      if (!this.isBookDropdown) return;
      return getCoverSrc(this.option);
    },
    coverAlt() {
      if (!this.isBookDropdown) return;
      return getCoverAlt(this.fullTitle, this.authorsText);
    },
    fullTitle() {
      if (!this.isBookDropdown) return;
      return getFullTitle(this.option);
    },
    slug() {
      if (!this.isBookDropdown) return;
      return getSlug(this.option);
    },
    authorsText() {
      if (!this.isBookDropdown) return;
      return getAuthorsText(this.option);
    },
  },
};
</script>
