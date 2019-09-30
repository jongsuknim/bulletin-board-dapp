<template>
	<div>
  <h1>{{ message }}!</h1>

  <!-- <button v-on:click=""> -->
  <input v-model="newMessage" :placeholder="message">
  <button v-on:click="onRegisterClick">Register</button>
</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: false
    }
  }, 
  data: function() {
  	return {
  		newMessage: ''
  	}
  },
  methods: {
  	onRegisterClick() {
  		console.log("onRegisterClick");
  		this.$emit("onRegisterClick", this.newMessage);
  	}
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>