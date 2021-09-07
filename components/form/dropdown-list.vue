<template>
  <div>
    <ul v-if="options.length !== 0" :class="dropdownClass">
      <DropdownItem
        v-for="option in options"
        :key="option.value"
        :option="option"
        :size="size"
        :is-book-dropdown="isBookDropdown"
        @mouseenter="handleOptionHover"
        @select-option="handleSelectOption"
      />
    </ul>
    <ul v-else :class="dropdownClass">
      <DropdownItem
        :option="{ label: noOptionsMessage }"
        :size="size"
        @mouseenter="handleOptionHover"
      />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isSelect: {
      type: Boolean,
      default: false,
    },
    inputValue: {
      type: String,
      default: '',
    },
    isBookDropdown: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: 'medium',
    },
    activeOptionClass: {
      type: String,
      default: 'medium',
    },
    noOptionsMessage: {
      type: String,
      default: 'No results found',
    },
  },
  computed: {
    dropdownClass() {
      return [
        'h-auto max-h-72 overflow-y-scroll transition-all dropdown w-full absolute top-full left-0 shadow-md rounded-lg overflow-hidden border border-gray-300',
        {
          'mt-1': !this.isSelect,
          'rounded-t-none border-t-0': this.isSelect,
        },
      ];
    },
  },
  watch: {
    options() {
      setTimeout(() => {
        this.setFirstOptionAsActive();
      }, 5);
    },
  },
  mounted() {
    this.setFirstOptionAsActive();
  },
  methods: {
    getActiveOptionNode() {
      return this.$el?.querySelector(`.${this.activeOptionClass}`);
    },
    setFirstOptionAsActive() {
      this.getActiveOptionNode()?.classList?.remove(this.activeOptionClass);
      if (this.options.length !== 0) {
        this.$el?.firstElementChild?.firstElementChild?.classList?.add(this.activeOptionClass);
      }
    },
    handleOptionHover(event) {
      this.getActiveOptionNode()?.classList?.remove(this.activeOptionClass);
      if (this.options.length !== 0) {
        event.target.classList.add(this.activeOptionClass);
      }
    },
    handleSelectOption(event) {
      this.$emit('select-option', event);
      this.setFirstOptionAsActive();
    },
  },
};
</script>

<style lang="postcss" scoped>
.dropdown {
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

.select-option-is-active {
}
</style>
