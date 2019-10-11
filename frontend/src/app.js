import Vue from 'vue'
import App from './App.vue'
import App2 from './App2.vue'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import '../assets/app.styl';

import web3 from './contracts/web3';
import BulletinBoardContract from './contracts/BulletinBoardInstance';
import BulletinNFTContract from './contracts/BulletinNFTInstance';
import NFTMarketContract from './contracts/NFTMarketInstance';

const extend = require('util')._extend;

Vue.use(BootstrapVue);

const MY_SPACE="mySpace";
const OTHER_SPACE="otherSpace";

const sleep = (ms) => {
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }

const nftMax = 10;

var appvue = new Vue({
    el: '#app',
    data: {
        mode: "Edit",
        pendingWithdrawal: 100,
        currentAccount: '',
        memos: [
        ]        
    },
    created() {
        this.reloadAll();
        // console.log(this.memos);
    },
    methods: {
        async updateAccount() {
            const accounts = await web3.eth.getAccounts();
            this.currentAccount = accounts[0];
            console.log("this.currentAccount", this.currentAccount);
        },

        newMemo(id, owner, message, bidPrice, bidder) {

            let retval = {id: id, message: message};

            if (owner == this.currentAccount)
                retval["status"] = MY_SPACE;
            else
                retval["status"] = OTHER_SPACE;

            if (bidPrice > 0) {
                retval["bid"] = Number(bidPrice);
                if (bidder == this.currentAccount) {
                    retval["myBid"] = true;
                }
            }

            retval["registerText"] = this.registerText;
            retval["doSell"] = this.doSell;
            retval["doBid"] = this.doBid;

            return retval;
        },

        async reloadAll() {
            await Promise.all([this.reloadPendingWithdrawal(), this.reloadMemos()]);
        },

        async reloadPendingWithdrawal() {
            await this.updateAccount();
            this.pendingWithdrawal = Number(await NFTMarketContract.methods.pendingWithdrawals(this.currentAccount).call());
        },

        async reloadMemos() {
            // await sleep(1000);
            await this.updateAccount();

            console.log("NFTMarketContract._address", NFTMarketContract._address);
            await this.updateAccount();

            let promiseList = [];
            for(let i=0; i < nftMax; i++) {
                promiseList.push(BulletinNFTContract.methods.ownerOf(i).call());
            }
            for(let i=0; i < nftMax; i++) {
                promiseList.push(BulletinBoardContract.methods.board(i).call());
            }
            for(let i=0; i < nftMax; i++) {
                promiseList.push(NFTMarketContract.methods.bidPrices(i).call());
            }
            for(let i=0; i < nftMax; i++) {
                promiseList.push(NFTMarketContract.methods.bidders(i).call());
            }

            let results = await Promise.all(promiseList);

            let idx = 0;
            let owners = results.slice(idx, idx + nftMax); idx += nftMax;
            let texts = results.slice(idx, idx + nftMax); idx += nftMax;
            let prices = results.slice(idx, idx + nftMax); idx += nftMax;
            let bidders = results.slice(idx, idx + nftMax);

            let _memos = []
            
            for(let i=0; i < nftMax; i++) {
                _memos.push(this.newMemo(i, owners[i], texts[i], prices[i], bidders[i]));
            }

            this.memos = _memos;
        },

        async registerText(id, newText) {
            console.log("registerText", id, newText);

            // let editing = extend({}, this.memos[id]);
            // editing.message = "Editing... ";
            // this.memos[id] = editing;

            await BulletinBoardContract.methods.registerText(id, newText).send({ from: this.currentAccount });

            await this.reloadAll();
            this.onTextMode();
        },

        async doSell(id) {
            let approvedAddress = BulletinNFTContract.methods.getApproved(id).call();
            console.log("sell", this.currentAccount, NFTMarketContract._address, id, NFTMarketContract._address == approvedAddress);

            if (BulletinNFTContract.methods.getApproved(id).call() != approvedAddress) {
                await BulletinNFTContract.methods.approve(
                    NFTMarketContract._address, id).send({ from: this.currentAccount});
            }
            
            await NFTMarketContract.methods.sell(id).send({ from: this.currentAccount });
            await this.reloadAll();
            this.onTextMode();
        },

        async doBid(id, newPrice) {
            console.log("bid", id, newPrice);

            await NFTMarketContract.methods.bid(id).send({value: newPrice, from: this.currentAccount});
            
            await this.reloadAll();
            this.onTextMode();
        },

        async receivePendingWithdrawal() {
            console.log("receivePendingWithdrawal");

            await NFTMarketContract.methods.requestPendingWithdrawals().send({from: this.currentAccount});

            await this.reloadAll();
            this.onTextMode();
        },
        onTextMode() {
            this.mode='Text';
        },
        onEditMode() {
            this.mode='Edit';
        },
        onMarketMode() {
            this.mode='Market';
        },
        onMyPageMode() {
            this.mode='MyPage';
        }
    },
    render: h => h(App)
})