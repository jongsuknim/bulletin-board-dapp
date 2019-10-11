<template>
    <div>
      <b-card style="max-width: 40rem; margin: auto;" class="mb-2">
        <b-alert v-model="receiving" variant="success" show>Receiving</b-alert>

        <b-card-body class="text-center">
          <b-row>
            <b-col>
              <b-card-text> pendingWithdrawal: {{ pendingWithdrawal }} </b-card-text>
            </b-col>
            <b-col>
              <b-button v-on:click="receive">받기</b-button>
            </b-col>
          </b-row>

        </b-card-body>
      </b-card>
    </div>
</template>
<script>
export default {
  props: {
    pendingWithdrawal: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      receiving: false
    }
  },
  methods: {
    async receive() {
      this.$emit("onReceivePendingWithdrawal");
      this.receiving = true;
    }
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>