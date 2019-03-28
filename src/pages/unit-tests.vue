<template>
  <q-page class="flex flex-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div class="row justify-around text-center">
      <span class="col-12 q-display-2 q-mb-lg">Choose your account</span>

      <q-btn @click="$router.push('/account/' + x)" v-for="x in accounts" :label="x" :key="x" class="q-pa-lg col-2" no-caps/>
  <!-- <q-btn v-for="x in publicKeys" :label="x.slice(0, 10) + '...' + x.slice(-5)" :key="x" class="q-pa-lg q-mx-md col-2" no-caps /> -->

        <!-- <q-btn color="light" v-for="x in publicKeys" :label="x.slice(0, 8) + '...' + x.slice(-5)" :key="x" no-caps class="q-mx-md"> -->
<!--           <q-chip floating color="primary">x</q-chip>
        </q-btn> -->
       <!--  <div class="q-ma-md row col-12 justify-center text-center">
          <span class="col-12 q-display-1 q-mb-lg">1-click account actions (unit tests)</span>

          <q-btn @click="transfer(x); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="x + ' sends 0.0001 EOS to altshiftdev1'" :key="'transfer' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="buyRam(x); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'buyRam for ' + x" :key="'buyram' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="sellRam(x); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'sellRam for ' + x" :key="'sellram' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="increaseStake(x); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'increase cpu & net stake for ' + x" :key="'increaseStake' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="decreaseStake(x); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'decrease cpu & net stake for ' + x" :key="'decreaseStake' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="vote(x, ['lioninjungle']); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'vote for lioninjungle using ' + x" :key="'voteOne' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="vote(x, ['lioninjungle', 'southafricas', 'blocksmithio',
          'eosmesofrogs', 'mosquitometa', 'okapitestnet', 'galapagoloco', 'atticlabjbpn', 'alohaeostest', 'ajungletitan']); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'vote for 10 different BP\'s using ' + x" :key="'voteMany' + x" class="q-mx-md col-auto" no-caps/>

          <q-btn @click="vote(x, [], 'myfirstproxy'); titleOne = 'UnSigned Transaction - Approve on Ledger Nano S'; responseData = {}" v-for="x in accountNames" :label="'set a voting proxy using ' + x" :key="'voteProxy' + x" class="q-mx-md col-auto" no-caps/>

        </div> -->
    </div>
  </q-page>
</template>

<style>
</style>

<script>

import Transport from '@ledgerhq/hw-transport-u2f' // for browser
import Eth from '@ledgerhq/hw-app-eth'

const getAddress = async (val) => {
  // console.log('getAddress', val)
  const transport = await Transport.create()
  const eth = new Eth(transport)
  const result = await eth.getAddress("44'/60'/0'/" + val, false, false)
  return result
}

export default {
  name: 'Wallet',
  data () {
    return {
      accounts: ['bitfinexeos1', 'altshiftdev1', 'eosnewyorkio', 'eos42freedom', 'cypherglasss']
      // walletPlatform: '',
      // loading: false
    }
  },
  mounted () {
    // this.getAccounts()
  },
  methods: {
    getAccounts () {
      let count = 2
      for (var i = 0; i < count; i++) {
        getAddress(i).then(response => {
          console.log(response.address)
          // this.accounts.push(response.address)
        })
      }
    }
  }
}
</script>
