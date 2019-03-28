<template>
  <div class="bg-grey-2 q-px-md" style="z-index: 9; width: 100vw" v-if="accountData.account_name">

    <account-resources :accountData="accountData" v-on:modifyRam="$emit('modifyRam')" v-on:modifyStake="$emit('modifyStake')" />

    <q-alert icon="new_releases" class="col-12 q-pb-md full-width" color="secondary">
      Update: <a href="https://medium.com/@altShiftDev/altshiftdev-presents-meownet-e62cbc9a6061" target="_blank">The MEOWnet has launched</a> - You can now vote on Referendums & Polls with your Hardware Wallets!
    </q-alert>

    <q-tabs ref="tabs" style="min-height: calc(100vh - 518px);" align="justify" class="full-width q-pb-xl" inverted color="grey-8">

      <q-tab default slot="title" name="tab-1" icon="account_balance" :label="$t('tabs.balance')" hide="label"/>
      <q-tab slot="title" name="tab-2" icon="history" :label="$t('tabs.transactions')" hide="label"/>
      <q-tab slot="title" name="tab-3" icon="how_to_vote" :label="$t('tabs.voting')" hide="label"/>
      <q-tab slot="title" name="tab-4" icon="code" :label="$t('tabs.rawData')" hide="label"/>

      <q-tab-pane name="tab-1" class="row justify-around">
        <account-balance :accountData="accountData" :totalBalance="totalBalance" :resources="resources" :tokenData="tokenData" :eosPrice="eosPrice" :settings="settings" v-on:updateSettings="passSettings"/>
      </q-tab-pane>

      <q-tab-pane name="tab-2" class="row justify-around">
        <account-history :accountName="accountData.account_name" :historyData="historyData"/>
      </q-tab-pane>

      <q-tab-pane name="tab-3" class="row justify-around">
        <account-voting :accountData="accountData" :bpList="bpList" :totalWeight="totalWeight" v-on:vote="passVote"/>
      </q-tab-pane>

      <q-tab-pane name="tab-4" class="full-width">
        <raw-viewer titleOne="Account Data" titleTwo="Transaction Data" :JSONOne="accountData" :JSONTwo="historyData"/>
      </q-tab-pane>
    </q-tabs>

  </div>
</template>

<script>
import accountResources from 'components/account-resources.vue'
import accountBalance from 'components/account-balance.vue'
import accountHistory from 'components/account-history.vue'
import accountVoting from 'components/account-voting.vue'
import rawViewer from 'components/raw-viewer.vue'

export default {
  name: 'mainContent',
  components: {
    accountResources,
    accountBalance,
    accountHistory,
    accountVoting,
    rawViewer
  },
  props: ['accountData', 'totalBalance', 'resources', 'tokenData', 'historyData', 'bpList', 'totalWeight', 'titleOne', 'titleTwo', 'JSONOne', 'JSONTwo', 'eosPrice', 'settings'],
  data () {
    return {
    }
  },
  watch: {

  },
  methods: {
    passVote (selected) {
      this.$emit('vote', selected)
    },
    passSettings (settings) {
      this.$emit('updateSettings', settings)
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus">
@import '~variables'

.q-tab-pane
  padding 0
  height 100%

.q-tab-panes
  min-height: calc(100vh - 518px)

</style>
