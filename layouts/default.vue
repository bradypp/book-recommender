<template>
  <div>
    <header class="flex justify-between p-6">
      <div>logo</div>
      <div>search bar</div>
      <div>nav</div>
    </header>
    <Nuxt class="container" keep-alive :keep-alive-props="{ max: 20 }" />
  </div>
</template>
