<template>
  <div class="relative overflow-hidden" @click="$emit('click', $event)">
    <!-- TODO Add a loading spinner to replace the icon if is loading prop === true -->
    <SearchIcon
      v-if="withSearchIcon"
      style="top: 54%"
      class="absolute left-4 transform -translate-y-1/2 text-gray-400"
      :width="searchIconSize"
      :height="searchIconSize"
    ></SearchIcon>
    <input
      :id="id"
      ref="input"
      :class="inputClass"
      :type="type"
      :name="name"
      :value="value"
      :min="minNum"
      :max="maxNum"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @keydown="$emit('keydown', $event)"
    />
    <DeleteIcon
      v-if="withDeleteIcon && value"
      style="top: 52%"
      class="absolute right-2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
      :width="deleteIconSize"
      :height="deleteIconSize"
      @click="$emit('clear-value')"
    ></DeleteIcon>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    minNum: {
      type: Number,
      default: null,
    },
    maxNum: {
      type: Number,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
    withSearchIcon: {
      type: Boolean,
      default: false,
    },
    withDeleteIcon: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    inputClass() {
      return [
        'focus:outline-none py-2 w-full rounded',
        this.withSearchIcon ? 'pl-12' : 'pl-2',
        this.withDeleteIcon ? 'pr-12' : 'pr-2',
        { 'h-8 text-sm': this.size === 'small' },
        { 'h-10 text-md': this.size === 'medium' },
        { 'h-12 text-lg': this.size === 'large' },
      ];
    },
    searchIconSize() {
      return (
        (this.size === 'small' && '16') ||
        (this.size === 'medium' && '18') ||
        (this.size === 'large' && '20')
      );
    },
    deleteIconSize() {
      return (
        (this.size === 'small' && '26') ||
        (this.size === 'medium' && '28') ||
        (this.size === 'large' && '30')
      );
    },
  },
  methods: {
    getInputEl() {
      return this.$refs.input;
    },
  },
};
</script>


<style lang="postcss">
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
