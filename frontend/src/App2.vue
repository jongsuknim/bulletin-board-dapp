<template>
    <div>
      <b-card style="max-width: 40rem; margin: auto;" class="mb-2">
        <b-card-body class="text-center">
            <b-card-text> {{ mode }} </b-card-text>
            <b-card-text> {{ this.$root.$data.memos.length }} </b-card-text>
            <b-card-text> {{ this.$root.$data.memos[0].message }} </b-card-text>
            <b-button v-on:click="update">업데이트</b-button>
        </b-card-body>
      </b-card>
    </div>
</template>
<script>

export default {
    props: {
        _mode: {
          type: String,
          default: 'Text'
        }
    },
    data: function() {
        return {
            mode: this._mode // Edit, Market
        }
    },
    methods: {
        update() {
            this.$root.memos[0].message = "aa";
        }
    },
    components: {
    }
}
</script>