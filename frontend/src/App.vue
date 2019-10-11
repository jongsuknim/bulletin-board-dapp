<template>
  <div class="full-width">
    <b-nav style="max-width: 40rem; margin: auto;" tabs fill>
        <b-nav-item :active="this.$root.$data.mode === 'Text'" v-on:click="this.$root.onTextMode">Text</b-nav-item>
        <b-nav-item :active="this.$root.$data.mode === 'Edit'" v-on:click="this.$root.onEditMode">Edit</b-nav-item>
        <b-nav-item :active="this.$root.$data.mode === 'Market'" v-on:click="this.$root.onMarketMode">Market </b-nav-item>
        <b-nav-item :active="this.$root.$data.mode === 'MyPage'" v-on:click="this.$root.onMyPageMode">My Page </b-nav-item>
        <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
    </b-nav>

    <template v-if="this.$root.$data.mode=='Text'">
        <text-component v-for="memo in this.$root.$data.memos"
            :id="memo.id" :status="memo.status" 
            :message="memo.message ? memo.message:''" />
    </template>

    <template v-if="this.$root.$data.mode=='Edit'">
        <edit-component v-for="memo in this.$root.$data.memos"
            :id="memo.id" :status="memo.status" 
            :message="memo.message ? memo.message:''"
            v-on:onRegisterClick="memo.registerText" />
    </template>

    <template v-if="this.$root.$data.mode=='Market'">
        <market-component v-for="memo in this.$root.$data.memos"
            :id="memo.id" :status="memo.status" 
            :message="memo.message ? memo.message:''"
            :myBid="memo.myBid ? memo.myBid: false"
            :bid="memo.bid ? memo.bid: 0"
            v-on:onSellClick="memo.doSell" 
            v-on:onBidClick="memo.doBid" />
    </template>

    <template v-if="this.$root.$data.mode=='MyPage'">
        <mypage-component :pendingWithdrawal='this.$root.pendingWithdrawal'
            v-on:onReceivePendingWithdrawal='this.$root.receivePendingWithdrawal' />
    </template>

  </div>
</template>
<script>
import TextComponent from './components/TextComponent.vue'
import EditComponent from './components/EditComponent.vue'
import MarketComponent from './components/MarketComponent.vue'
import MyPageComponent from './components/MyPageComponent.vue'


export default {
    components: {
        'text-component':TextComponent,
        'edit-component':EditComponent,
        'market-component':MarketComponent,
        'mypage-component':MyPageComponent
    }
}
</script>