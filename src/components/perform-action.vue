<template>
  <q-card inline class="row items-center justify-around bg-white full-width no-wrap q-ma-md q-pa-md" style="height: auto">
    <template v-if="!showAdvanced">
      <div class="col-3 inline-block full-height full-width">
        <q-btn-dropdown :label="label" color="primary" class="q-mb-lg">
          <q-list link>
            <q-list-header>Advanced API Functions</q-list-header>
            <q-item v-for="(x, index) in actions" :key="index" v-close-overlay @click.native="label = index; action = x; actionKey = index">
              <q-item-main>
                <q-item-tile label>{{ index }}</q-item-tile>
                <q-item-tile sublabel>{{ x.brief }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="col-6 row items-center justify-between inline-block full-height full-width">

        <span v-if="label === 'Advanced API Functions'" class="q-subheading col-auto">Select an API function from the dropdown to see the required fields</span>
        <span v-else-if="label !== 'Advanced API Functions' && action.params === null" class="q-subheading col-auto">No Fields Required</span>
        <span v-else class="q-subheading col-auto">Fields</span>

        <div class="col-12 self-center row" >
          <div class="col-12 row self-center " v-if="action">
            <div class="col-12 row items-center justify-start capitalize">
              <q-input v-if="typeof f === 'string'" v-model.trim="action.params[fIndex]" :stack-label="fIndex" :placeholder="f" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>

              <q-input v-if="typeof f === 'object' && f.default !== undefined" v-model.trim="action.params[fIndex].default" :stack-label="fIndex" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>

              <q-input v-if="typeof f === 'object' && f.default === undefined" v-model.trim="action.params[fIndex].doc" :stack-label="fIndex" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>
            </div>
          </div>
        </div>
      </div>

      <div v-if="label !== 'Advanced API Functions'" class="col-3 row items-center justify-between inline-block text-center full-height full-width ">
        <q-btn @click="$emit('action', label, action)" color="primary" class="q-mb-lg self-center" label="send"/>
      </div>
    </template>

    <template v-if="showAdvanced">
      <div class="col-3 inline-block full-height full-width">
        <q-btn-dropdown :label="label" color="primary" class="q-mb-lg">
          <q-list link>
            <q-list-header>Advanced API Functions</q-list-header>
            <q-item v-for="(x, index) in actions" :key="index" v-close-overlay @click.native="label = index; action = x; actionKey = index">
              <q-item-main>
                <q-item-tile label>{{ index }}</q-item-tile>
                <q-item-tile sublabel>{{ x.brief }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="col-6 row items-center justify-between inline-block full-height full-width">

        <span v-if="label === 'Advanced API Functions'" class="q-subheading col-auto">Select an API function from the dropdown to see the required fields</span>
        <span v-else-if="label !== 'Advanced API Functions' && action.params === null" class="q-subheading col-auto">No Fields Required</span>
        <span v-else class="q-subheading col-auto">Fields</span>

        <div class="col-12 self-center row" >
          <div class="col-12 row self-center " v-if="action">
            <div class="col-12 row items-center justify-start capitalize">
              <q-input v-if="typeof f === 'string'" v-model.trim="action.params[fIndex]" :stack-label="fIndex" :placeholder="f" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>

              <q-input v-if="typeof f === 'object' && f.default !== undefined" v-model.trim="action.params[fIndex].default" :stack-label="fIndex" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>

              <q-input v-if="typeof f === 'object' && f.default === undefined" v-model.trim="action.params[fIndex].doc" :stack-label="fIndex" v-for="(f, fIndex) in action.params" :key="fIndex" class="col-auto q-ma-xs"/>
            </div>
          </div>
        </div>
      </div>

      <div v-if="label !== 'Advanced API Functions'" class="col-3 row items-center justify-between inline-block text-center full-height full-width ">
        <q-btn @click="$emit('action', label, action)" color="primary" class="q-mb-lg self-center" label="send"/>
      </div>
    </template>
  </q-card>
</template>

<script>

export default {
  name: 'performAction',
  props: ['apiCalls', 'showAdvanced'],
  data () {
    return {
      label: 'Advanced API Functions',
      action: {},
      actionKey: '',
      actions: this.apiCalls,
      walletFunctions: [
        {
          name: 'Send',
          brief: 'Send EOS or any other tokens to another account',
          action: 'transfer',
          helper: 'Memo\'s are usually optional but if you\'re sending money to a contract or exchange it may be a required field.',
          fields: {
            from: 'sender',
            to: 'receiver',
            amount: '1.0000',
            token: 'EOS',
            memo: ''
          }
        },
        {
          name: 'Create Account',
          brief: 'Create a new account',
          action: 'newAccount',
          helper: 'Account names should be 12 characters using lowercase letters "a-z" and number "0-9", accounts with less characters are considered premium accounts and need to be bid on at auction, use the Bid on Name" function for those instead.',
          helperTwo: 'A newly created account will need some EOS staked for CPU and Network and a few kb of RAM before it can interact with the blockchain so don\'t forget to use the "Stake" and "Buy Ram" function for the new account!',
          fields: {
            creator: 'creator',
            name: 'new account name',
            owner: 'pubkey of the creator',
            active: 'pubkey of the creator'
          }
        },
        {
          name: 'Buy Ram',
          brief: 'Purchase RAM for an EOS account or smart-contract',
          helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B of RAM for your account but 8192 B is safer.',
          helperTwo: 'The prices fluctuate based on supple and demand so you should research the price of RAM before running this function as it may cost you more EOS than you expect!',
          action: 'buyrambytes',
          fields: {
            payer: 'payer',
            receiver: 'receiver',
            bytes: 1024
          }
        },
        {
          name: 'Sell Ram',
          brief: 'Purchase RAM for an EOS account or smart-contract',
          helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B of RAM for your account but 8192 B is safer.',
          helperTwo: 'The prices fluctuate based on supple and demand so you should research the price of RAM before running this function as you may not receive as much EOS as you expect for your RAM!',
          action: 'sellram',
          fields: {
            account: 'seller',
            bytes: 1024
          }
        }
      ]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
@import '~variables'
</style>
