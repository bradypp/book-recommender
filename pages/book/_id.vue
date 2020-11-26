<template>
  <div>yo</div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route.params.id.split('-')[0]);
  },
};
</script>
