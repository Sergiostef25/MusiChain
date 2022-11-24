const Web3 = require('web3');
const MusiChain = require('../build/contracts/MusiChain.json');


const init = async () => {
    const web3 = new Web3('http://localhost:7545');
    const id = await web3.eth.net.getId();
    const deployedNetwork = MusiChain.networks[id];
    const contractMusiChain = new web3.eth.Contract(MusiChain.abi, deployedNetwork.address);

    const addresses = await web3.eth.getAccounts();


    contractMusiChain.methods.addSong('Gaetano', 'Indie', 'Mainstream', 2015, 242).send({from: addresses[1], gas: 300000})
    .then(receipt => {
        console.log(receipt);
    }).catch(error => {
        console.log(error.message);
    });
}

init();