<template>
  <v-app> 
    <v-app-bar
      dark
      app
    >
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        
          <router-link to="/" style="text-decoration: none; color: inherit;">
            <v-toolbar-title >MusiChain
            <v-app-bar-nav-icon class="mr-5">
              <v-img
                :src="require('./assets/musichain2.svg')"
                class="mrl-8"
                contain
                max-height="50"
          max-width="50"/>
            </v-app-bar-nav-icon>
          </v-toolbar-title>
          </router-link>
          <!-- connect-wallet button is visible if the wallet is not connected -->
          <v-btn text v-if="!connected" @click="connect" fixed right>Connect Wallet</v-btn>
          <v-btn text v-if="connected" disabled fixed right>Wallet Connected</v-btn>
          

      
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list
        nav
        dense
      >
        

        <v-list-item-group
          v-model="group"       
        >
          
          <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-item-icon>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{link.text}}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>

      <v-container fluid>
        <!-- If using vue-router -->
        <router-view 
          :connected="connected" 
          :address="address" 
          :artistName="artistName" 
          :artistList="artistList"
          @changeArtistName="artistName = $event" 
          @addArtist="artistList = $event">
          </router-view>

      </v-container>

    </v-main>

    <v-footer app>
    <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
var uuid = require("uuid");
const Web3 = require('web3');
const MusiChain = require('../build/contracts/MusiChain.json');
var web3=null;
var id=null;
var deployedNetwork=null;
var contractMusiChain=null;
export default {
  name: 'App',
  data() {
      return {
        address: null,
        artistName: 'none',
        artistList: [],
        connected: false,
        drawer: false,
        group: null,
        links: [
          {icon: 'mdi-home', text: 'Home', route: '/'},
          {icon: 'mdi-account-circle', text: 'Artist', route: '/artist'},
          {icon: 'mdi-cart-arrow-down', text: 'Buy Song', route: '/buy'},
          {icon: 'mdi-playlist-music', text: 'Library', route: '/library'},
          {icon: 'mdi-play', text: 'Music Player', route: '/player'},
          
        ]
      }
    },
  
  
    created(){
    const init = async () => {
            web3 = new Web3('http://localhost:7545');
            id = await web3.eth.net.getId();
            deployedNetwork = MusiChain.networks[id];
            contractMusiChain = new web3.eth.Contract(MusiChain.abi, deployedNetwork.address);

            const result = await contractMusiChain.getPastEvents('artistAdded', {fromBlock: 0});

            for (let [, value] of Object.entries(result)) {
                
                this.artistList.push({id: value.returnValues[1],name : value.returnValues[2], link_avatar: value.returnValues[3]});
            }
            
          }

          init();
  },
  methods:{
      connect(){

        if(window.ethereum){
          window.ethereum.request({method: 'eth_requestAccounts'})
          .then(() => {
            this.connected = true;
            this.address = window.ethereum.selectedAddress;

            const init = async () => {
            web3 = new Web3(window.ethereum);
            id = await web3.eth.net.getId();
            deployedNetwork = MusiChain.networks[id];
            contractMusiChain = new web3.eth.Contract(MusiChain.abi, deployedNetwork.address);

            const result = await contractMusiChain.methods.artists(this.address).call();
            if(result.length > 0){
              this.artistName = result;
            }

            const result2 = await contractMusiChain.methods.users(this.address).call();
            if(result2.length == 0){
              var randomKey = uuid.v4();
              console.log(randomKey);
              console.log(this.address);
              const result3 = await contractMusiChain.methods.addUser(this.address, randomKey).send({from: this.address});
              console.log(result3);
            }
          }

          init();
           
          })
        }
      },


  }
};
</script>
