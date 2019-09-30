import Vue from 'vue';
import App from './App.vue';

import web3 from './contracts/web3';
import contract from './contracts/contractInstance';

import '../assets/app.styl';

new Vue({
	el: '#app',
	data: {
		currentMessage: '',
		currentAccount:'',
		loading: false,
		contract
	},
	/* get acount & currentMessage */
	async created() {
		await this.updateAccount();
		await this.getMessage();
	},
	// transformToRequire: {
	// 	img: 'src',
	// 	image: 'xlink:href',
	// },
	methods: {
		async updateAccount() {
			const accounts = await web3.eth.getAccounts();
			const account = accounts[0];
			this.currentAccount = account;
			console.log("this.currentAccount", accounts[0], account, this.currentAccount);
		},

		async getMessage() {
			this.loading = true;
			this.currentMessage = 
				await contract.methods.message().call({ from: this.currentAccount });
			this.loading = false;
			console.log("this.currentMessage", this.currentMessage);
		}
	},
	render: h => h(App)
})