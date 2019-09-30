<template>
  <h1>{{ message }}!</h1>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>