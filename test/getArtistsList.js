const Web3 = require('web3');
const MusiChain = require('../build/contracts/MusiChain.json');

const init = async () => {
    const web3 = new Web3('http://localhost:7545');
    const id = await web3.eth.net.getId();
    const deployedNetwork = MusiChain.networks[id];
    const contractMusiChain = new web3.eth.Contract(MusiChain.abi, deployedNetwork.address);

    //const addresses = await web3.eth.getAccounts();

    const result = await contractMusiChain.getPastEvents('artistAdded', {fromBlock: 0});
    
    for (let [key, value] of Object.entries(result)) {
    console.log(value.returnValues[2]);
    }

    
}

init();