<template>
  <div class="w-full relative z-10">
    <div :class="inputContainerClass">
      <BaseInput
        :id="inputId"
        ref="input"
        name="book-search"
        :value="inputValue"
        :size="size"
        :with-search-icon="withSearchIcon"
        :with-delete-icon="withDeleteIcon"
        :placeholder="placeholder"
        @input="$emit('input', $event)"
        @click="activateDropdown"
        @clear-value="clearInputValue"
        @keydown="handleInputKeyDown"
      />
    </div>
    <DropdownList
      v-if="isDropdownVisible"
      ref="dropdown"
      :options="renderedOptions"
      :active-option-class="activeOptionClass"
      :is-book-dropdown="isBookDropdown"
      :size="size"
      :is-select="isSelect"
      :no-options-message="noOptionsMessage"
      :input-value="inputValue"
      @select-option="selectOption"
      @deactivate-dropdown="deactivateDropdown"
    />
  </div>
</template>

<script>
import { keyCodes } from '@/utils/constants';

export default {
  props: {
    isBookDropdown: {
      type: Boolean,
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number, Array],
      default: null,
    },
    inputValue: {
      type: String,
      required: true,
    },
    shouldInputFilterOptions: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
    },
    withSearchIcon: {
      type: Boolean,
      default: false,
    },
    isDropdownActive: {
      type: Boolean,
      default: false,
    },
    withDeleteIcon: {
      type: Boolean,
      default: false,
    },
    onClickOutsideElements: {
      type: Array,
      default: () => [],
    },
    inputId: {
      type: String,
      default: null,
    },
    showDropdownWithInputOnly: {
      type: Boolean,
      default: false,
    },
    noOptionsMessage: {
      type: String,
      default: 'No results found',
    },
  },
  data() {
    return {
      targetElement: {},
      localIsDropdownActive: false,
      activeOptionClass: 'select-option-is-active',
    };
  },
  computed: {
    inputContainerClass() {
      return ['field-container', { 'rounded-b-none border-b-0': this.isSelect }];
    },
    isDropdownVisible() {
      const isActive = this.isSelect ? this.isDropdownActive : this.localIsDropdownActive;
      return this.showDropdownWithInputOnly
        ? this.inputValue && !this.isLoading && isActive
        : !this.isLoading && isActive;
    },
    renderedOptions() {
      return this.options.filter(option => {
        const isOptionSelected = this.isMulti
          ? this.value.some(val => val === option.value)
          : this.value === option.value;
        const isOptionSearchedFor = this.shouldInputFilterOptions
          ? option.value.includes(this.inputValue.toLowerCase())
          : true;
        return !isOptionSelected && isOptionSearchedFor;
      });
    },
  },
  watch: {
    inputValue() {
      if (!this.inputValue && this.showDropdownWithInputOnly) {
        this.deactivateDropdown();
      }
    },
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
    clearInputValue() {
      this.$emit('clear-value');
      this.$refs.input?.getInputEl().focus();
    },
    handleMouseDown(event) {
      this.targetElement = event.target;
    },
    handleMouseUp(event) {
      const ignoredElements = [
        this.$refs.input?.$el,
        this.$refs.dropdown?.$el,
        ...this.onClickOutsideElements,
      ];

      if (ignoredElements.length !== 0) {
        const isTargetAChildOfIgnoredElement = ignoredElements.some(
          el => el && (el.contains(this.targetElement) || el.contains(event.target)),
        );
        if (event.button === 0 && !isTargetAChildOfIgnoredElement) {
          this.deactivateDropdown();
        }
      }
    },
    activateDropdown() {
      this.localIsDropdownActive = true;
    },
    deactivateDropdown() {
      if (this.isSelect) {
        this.$emit('deactivate-dropdown');
      } else {
        this.localIsDropdownActive = false;
      }
    },
    selectOption(optionValue) {
      if (this.isMulti) {
        const valueIndex = this.value.indexOf(optionValue);
        const isValueSelected = valueIndex !== -1;
        this.$emit(
          'select-option',
          this.preserveValueType(
            isValueSelected ? this.value.splice(valueIndex, 1) : [...this.value, optionValue],
          ),
        );
      } else {
        this.$emit('select-option', this.preserveValueType(optionValue));
      }

      if (!this.isSelect) this.localIsDropdownActive = false;
    },
    getActiveOptionNode() {
      return this.$el?.querySelector(`.${this.activeOptionClass}`);
    },
    handleInputKeyDown(event) {
      if (event.keyCode === keyCodes.ESCAPE) {
        this.handleInputEscapeKeyDown(event);
      } else if (event.keyCode === keyCodes.ENTER) {
        this.handleInputEnterKeyDown(event);
      } else if (event.keyCode === keyCodes.ARROW_DOWN || event.keyCode === keyCodes.ARROW_UP) {
        this.handleInputArrowUpOrDownKeyDown(event);
      }
    },
    handleInputArrowUpOrDownKeyDown(event) {
      const activeEl = this.getActiveOptionNode();

      if (!activeEl) return;

      const optionsEl = this.$el.firstElementChild;
      const optionsElHeight = optionsEl?.getBoundingClientRect().height;
      const activeElHeight = activeEl.getBoundingClientRect().height;

      if (event.keyCode === keyCodes.ARROW_DOWN) {
        if (optionsEl.lastElementChild === activeEl) {
          activeEl.classList.remove(this.activeOptionClass);
          optionsEl.firstElementChild?.classList.add(this.activeOptionClass);
          optionsEl.scrollTop = 0;
        } else {
          activeEl.classList.remove(this.activeOptionClass);
          activeEl.nextElementSibling?.classList.add(this.activeOptionClass);
          if (activeEl.offsetTop > optionsEl.scrollTop + optionsElHeight / 1.4) {
            optionsEl.scrollTop += activeElHeight;
          }
        }
      } else if (event.keyCode === keyCodes.ARROW_UP) {
        if (optionsEl.firstElementChild === activeEl) {
          activeEl.classList.remove(this.activeOptionClass);
          optionsEl.lastElementChild?.classList.add(this.activeOptionClass);
          optionsEl.scrollTop = optionsEl.scrollHeight;
        } else {
          activeEl.classList.remove(this.activeOptionClass);
          activeEl.previousElementSibling?.classList.add(this.activeOptionClass);
          if (activeEl.offsetTop < optionsEl.scrollTop + optionsElHeight / 2.4) {
            optionsEl.scrollTop -= activeElHeight;
          }
        }
      }
    },
    handleInputEscapeKeyDown(event) {
      event.stopImmediatePropagation();
      this.$emit('deactivate-dropdown');
    },
    handleInputEnterKeyDown(event) {
      event.preventDefault();
      const activeEl = this.getActiveOptionNode();
      if (!activeEl) return;

      const optionValueToSelect = activeEl.getAttribute('data-select-option-value');
      this.selectOption(optionValueToSelect);
    },
    preserveValueType(newValue) {
      const areOptionValuesNumbers = this.options.some(option => typeof option.value === 'number');

      if (areOptionValuesNumbers) {
        if (this.isMulti) {
          return newValue.map(Number);
        }
        if (newValue) {
          return Number(newValue);
        }
      }
      return newValue;
    },
  },
};
</script>
