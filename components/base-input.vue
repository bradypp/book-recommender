<template>
  <div>
    <input
      ref="input"
      class="border border-grey-500 rounded-md focus:outline-none px-3 w-full h-12 text-lg"
      type="text"
      name="main-search"
      :value="values.search"
      @:keyup.enter="submitForm(searchDropdown[0]._id)"
      @input="onSearchInput"
      @click="isDropdownActivated = true"
    />
  </div>
</template>
