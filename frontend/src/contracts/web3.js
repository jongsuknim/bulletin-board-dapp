import Web3 from 'web3';

let currentWeb3;

if (window.ethereum) {
    let instance = new Web3(window.ethereum);
    try {
        // Request account access if needed
        window.ethereum.enable();
        // Accounts now exposed
        currentWeb3 = instance;
    } catch (error) {
        alert('Please allow access for the app to work');
    }
} else if (window.web3) {
    currentWeb3 = new Web3(web3.currentProvider);
    // Accounts always exposed
    resolve(currentWeb3);
} else {
    console.log('Non-Ethereum browser detected. You should consider trying Metamask!');
}

export default currentWeb3;


