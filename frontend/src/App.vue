<template>
  <div class="full-width center-content">
    <message-component :message="this.$root.$data.currentMessage" />
    <p> {{ this.$root.$data.currentMessage}} </p>
  </div>
</template>
<script>
import MessageComponent from './components/MessageComponent.vue'

export default {
	components: {
		MessageComponent
	}
}
</script>

