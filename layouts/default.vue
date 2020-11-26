<template>
  <div>
    <header class="h-16">header</header>
    <Nuxt class="container" keep-alive :keep-alive-props="{ max: 20 }" />
  </div>
</template>
