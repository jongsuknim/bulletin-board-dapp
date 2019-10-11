<template>
    <div>

      <b-card style="max-width: 40rem; margin: auto;" class="mb-2">
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-alert v-model="bidding" variant="success" show>Bidding</b-alert>
        <b-alert v-model="selling" variant="success" show>Selling</b-alert>

        <b-card-body class="text-center">
          <b-card-text>{{message}}</b-card-text> 
          <template v-if="status=='mySpace'">
            <b-row>
              <b-col style="max-width: 5rem;">
                <b-card-text>bid:</b-card-text> 
              </b-col>
              <template v-if="bid > 0">
                <b-col>
                  <b-card-text>{{bid}} wei</b-card-text> 
                </b-col>
                <b-col>
                  <b-button v-on:click="sellClick">{{bid}}에 팔기</b-button>
                </b-col>
              </template>
              <template v-else>
                <b-col><b-card-text >None</b-card-text></b-col>
                <b-col></b-col>
              </template>
            </b-row>
          </template>

          <template v-else>
            <b-row>
              <b-col style="max-width: 5rem;">
                <b-card-text>bid:</b-card-text>
              </b-col>

              <template v-if="registerMode">
                <b-col>
                  <b-form-input v-model="newBidPrice"></b-form-input>
                </b-col>
                <b-col>
                  <b-button v-on:click="exitRegisterMode">취소</b-button>
                  <b-button v-on:click="bidClick">완료</b-button>
                </b-col>
              </template>
              <template v-else-if="bid > 0">
                <b-col>
                  <b-card-text v-if="myBid">*{{bid}} </b-card-text>
                  <b-card-text v-else> {{bid}} </b-card-text>
                </b-col>
              </template>
              <template v-else>
                <b-col>
                  <b-card-text>None</b-card-text>
                </b-col>
              </template>

              <template v-if="!registerMode">
                <b-col>
                  <b-button v-on:click="enterRegisterMode">bid 등록</b-button>
                </b-col>
              </template>
            </b-row>

          </template>
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
    },
    bid: {
      type: Number,
      default: 0
    },
    myBid: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      newAskPrice: 0,
      newBidPrice: 0,
      errorMessage: "",
      showDismissibleAlert: false,
      registerMode: false,
      bidding: false,
      selling: false
    }
  },
  methods: {
    sellClick() {
      this.selling = true;
      this.$emit("onSellClick", this.id);
    },
    bidClick() {
      if (Number(this.newBidPrice) > this.bid) {
        this.$emit("onBidClick", this.id, Number(this.newBidPrice));
        this.bidding = true;
        this.exitRegisterMode();
      } else {
        this.errorMessage = `new bid price should be greater than ${this.bid}`;
        this.showDismissibleAlert=true;
        this.exitRegisterMode();
      }
      // this.exitRegisterMode();
    },
    enterRegisterMode() {
      this.registerMode = true;
    },
    exitRegisterMode() {
      this.registerMode = false;
    }
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>