<template>
  <div>
    <label
      ref="select"
      :class="selectClass"
      :for="inputId"
      tab-index="0"
      @keyDown="handleFocusedSelectKeydown"
      @click="toggleDropdown"
    >
      <!-- If single - show single value & downward arrow icon & event to open dropdown -->
      <!-- If multi - show all selected values, if empty have the appearence of a single & event to open dropdown on click -->
      <div v-if="isValueEmpty && valuePlaceholder && !isMulti" class="pl-2 pr-10 w-full">
        {{ valuePlaceholder }}
      </div>
      <!-- TODO edit appearance for multiple selections -->
      <div v-else-if="isValueEmpty && valuePlaceholder && isMulti" class="pl-2 pr-10 w-full">
        {{ valuePlaceholder }}
      </div>
      <!-- TODO show selected value -->
      <div v-else-if="!isValueEmpty && !isMulti" class="pl-2 pr-10 w-full">
        {{ getOptionLabel(value) }}
      </div>
      <!-- TODO show selected multiple values with the ability to deselect -->
      <div v-else-if="!isValueEmpty && isMulti" class="pl-2 pr-10 w-full flex flex-wrap">
        <div
          v-for="option in value"
          :key="uniqueId(option)"
          class="
            py-0.5
            px-1.5
            border
            mr-1
            my-1
            flex
            font-secondary
            rounded-lg
            relative
            items-center
            cursor-pointer
            text-gray-600
          "
          @click.stop="deselectOption(option)"
        >
          <span class="text-sm capitalize">
            {{ getOptionLabel(option) }}
          </span>
          <DeleteIcon :width="deleteIconSize" :height="deleteIconSize" class="ml-1 text-base" />
        </div>
      </div>
      <ArrowDownIcon :width="arrowIconSize" :height="arrowIconSize" :class="arrowIconClass" />
    </label>
    <InputDropdown
      v-if="isDropdownActive"
      :value="value"
      :options="options"
      :is-loading="isDropdownLoading"
      :input-value="inputValue"
      with-delete-icon
      :on-click-outside-elements="[this.$refs.select]"
      is-controlled
      is-select
      :no-options-message="noOptionsMessage"
      should-input-filter-options
      :input-id="inputId"
      :placeholder="inputPlaceholder"
      :is-dropdown-active="isDropdownActive"
      :is-multi="isMulti"
      :size="size"
      @input="onInput"
      @select-option="selectOption"
      @clear-value="clearInputValue"
      @deactivate-dropdown="deactivateDropdown"
    />
  </div>
</template>

<script>
import { uniqueId, uniq } from 'lodash';
import { keyCodes } from '@/utils/constants';

export default {
  props: {
    options: {
      type: Array,
      required: true,
      /* shape: [{
        value: [Array, String, Number],
        label: String
      }] */
    },
    value: {
      type: [String, Number, Array],
      default: null,
    },
    valuePlaceholder: {
      type: String,
      default: 'Select',
    },
    inputPlaceholder: {
      type: String,
      default: 'Search',
    },
    noOptionsMessage: {
      type: String,
      default: 'No results found',
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    isDropdownLoading: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
    },
    propsId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isDropdownActive: false,
      inputValue: '',
      inputId: this.propsId || uniqueId('select-input-'),
    };
  },
  computed: {
    selectClass() {
      return [
        'field-container mb-1 focus:outline-none w-full cursor-pointer flex items-center relative',
        { 'min-h-8 text-sm': this.size === 'small' },
        { 'min-h-10 text-md': this.size === 'medium' },
        { 'min-h-12 text-lg': this.size === 'large' },
      ];
    },
    arrowIconClass() {
      return [
        'absolute right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer top-1/2 transition duration-200',
        { 'rotate-180': this.isDropdownActive },
      ];
    },
    arrowIconSize() {
      return (
        (this.size === 'small' && '12') ||
        (this.size === 'medium' && '14') ||
        (this.size === 'large' && '16')
      );
    },
    deleteIconSize() {
      return (
        (this.size === 'small' && '14') ||
        (this.size === 'medium' && '18') ||
        (this.size === 'large' && '22')
      );
    },
    isValueEmpty() {
      return this.isMulti ? this.value.length === 0 : !this.getOption(this.value);
    },
  },
  methods: {
    uniqueId,
    handleFocusedSelectKeydown(event) {
      if (this.isDropdownActive) return;
      if (event.keyCode === keyCodes.ENTER) {
        event.preventDefault();
      }
      if (event.keyCode !== keyCodes.ESCAPE && event.keyCode !== keyCodes.TAB && !event.shiftKey) {
        this.isDropdownActive = true;
      }
    },
    onInput(value) {
      this.inputValue = value;
    },
    clearInputValue() {
      this.inputValue = '';
    },
    selectOption(optionValue) {
      if (!this.isMulti) {
        this.clearInputValue();
        this.deactivateDropdown();
        this.$emit('select-option', optionValue);
      } else {
        this.$emit('select-option', uniq([...this.value, ...optionValue]));
      }
    },
    deselectOption(optionValue) {
      this.$emit(
        'select-option',
        this.value.filter(val => val !== optionValue),
      );
    },
    getOption(optionValue) {
      return this.options.find(option => option.value === optionValue);
    },
    getOptionLabel(optionValue) {
      return (this.getOption(optionValue) || { label: '' }).label;
    },
    activateDropdown() {
      if (!this.isDropdownActive) {
        this.isDropdownActive = true;
      }
    },
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    deactivateDropdown() {
      this.isDropdownActive = false;
      this.inputValue = '';
      this.$refs.select?.current?.focus();
    },
  },
};
</script>
