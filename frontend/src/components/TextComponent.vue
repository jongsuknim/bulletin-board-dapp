<template>
    <div>
      <b-card style="max-width: 40rem; margin: auto;" class="mb-2">
        <b-card-body class="text-center">
            <b-card-text> {{ message }} </b-card-text>
        </b-card-body>
      </b-card>
    </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
        newMessage: ''
    }
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>