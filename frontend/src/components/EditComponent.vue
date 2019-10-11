<template>
    <div>
      <b-card style="max-width: 40rem; margin: auto;" class="mb-2">
        <b-alert v-model="editing" variant="success" show>Editing...</b-alert>

        <b-card-body class="text-center">
          <template v-if="status =='otherSpace'">
            <b-card-text> {{ message }} </b-card-text>
          </template>

          <template v-if="status =='mySpace'">
            <template v-if="registerMode">
              <b-form-input v-model="newMessage"></b-form-input>
              <b-button v-on:click="exitRegisterMode">취소</b-button>
              <b-button v-on:click="registerClick">적용</b-button>        
            </template>
            <template v-else>
              <template v-if="message !== ''">
                <b-card-text > {{ message }} </b-card-text>
                <b-button v-on:click="enterRegisterMode">수정</b-button>  
              </template>
              <template v-else>
                <b-button v-on:click="enterRegisterMode">등록</b-button>  
              </template>
            </template>
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
    }
  },
  data: function() {
    return {
        newMessage: this.message,
        registerMode: false,
        editing: false
    }
  },
  methods: {
    enterRegisterMode() {
      this.registerMode = true;
    },
    exitRegisterMode() {
      this.registerMode = false;
    },
    async sleep (ms) {
      return new Promise(resolve=>{
        setTimeout(resolve,ms)
      })
    },
    async registerClick() {
      this.$emit("onRegisterClick", this.id, this.newMessage);
      this.editing = true;
    }
  }
}
</script>
<style lang="stylus" scoped>
h1
  color red
</style>