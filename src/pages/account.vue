<template>
  <q-page class="flex">
    <meow-api v-if="$q.platform.within.iframe && eosPrice.ramEOS !== null" :accountData="accountData" :resources="resources" :tokenData="tokenData" :eosPrice="eosPrice"/>

    <template v-if="accountData.account_name && !$q.platform.within.iframe" >

      <account-header :key="$eos.config.chainId" :totalBalance="totalBalance" :eosPrice="eosPrice" :airdrops="resources.airdrops" :settings="settings"/>

      <main-content ref="mainContent" :accountData="accountData" :totalBalance="totalBalance" :resources="resources" :tokenData="tokenData" :historyData="historyData" :bpList="bpList" :totalWeight="totalWeight" :titleOne="$t('raw.accountData')" :titleTwo="$t('raw.txData')" :JSONOne="accountData" :JSONTwo="historyData" :eosPrice="eosPrice" :settings="settings" v-on:vote="prepareVote" v-on:modifyRam="modifyRam" v-on:modifyStake="modifyStake" v-on:updateSettings="updateSettings"/>

      <q-btn @click="(!$q.platform.is.chrome && !$q.platform.is.opera) ? needsChrome() : modalOpen = true"
        round glossy
        size="lg"
        color="deep-purple"
        class="absolute"
        style="left: 18px; top: 168px; z-index: 9;">
        <img style="height: 25px;" type="image/svg+xml" src="statics/ledger_simple.svg">
      </q-btn>
    </template>

    <q-modal :maximized="modalMaximized" v-if="accountData.account_name && !$q.platform.within.iframe" v-model="modalOpen" :content-css="{minWidth: '80vw', minHeight: '500px'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="grey-8">

          <q-toolbar-title>

            <q-btn-dropdown color="deep-purple" glossy :label="actionLabel" no-caps>

              <q-list link>
                <q-list-header>{{ $t('eosAPI.basic') }}</q-list-header>
                <q-item v-for="(x, index) in basicFunctions" :key="index" v-close-overlay @click.native="actionLabel = x.label; actionState = x.value; actionIcon = x.icon;resetStepper()">
                  <q-item-main>
                    <q-item-tile label>{{ x.label }}</q-item-tile>
                    <q-item-tile sublabel>{{ x.brief }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>

              <q-list link>
                <q-list-header>{{ $t('eosAPI.advanced') }}</q-list-header>
                <q-item v-for="(x, index) in advancedFunctions" :key="index" v-close-overlay @click.native="actionLabel = x.label; actionState = x.value; actionIcon = x.icon;resetStepper()">
                  <q-item-main>
                    <q-item-tile label>{{ x.label }}</q-item-tile>
                    <q-item-tile sublabel>{{ x.brief }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-btn-dropdown>

          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="minimize"
          />
          <q-btn
            flat
            round
            dense
            class="maximize-icon"
            @click="modalMaximized = !modalMaximized"
            :icon="modalMaximized ? 'fullscreen_exit' : 'fullscreen'"
          />
        </q-toolbar>

        <template v-if="!actionState">
          <div class="row col-12 justify-around items-center q-mx-md" style="height: 400px">
            <q-btn class="col-md-3 col-sm-5 col-xs-10 q-ma-xs" style="height: 50px;" color="secondary" v-for="(x, basic) in basicFunctions" :key="`basic${basic}`" glossy push @click="actionLabel = x.label; actionState = x.value; actionIcon = x.icon; resetStepper()">

<!--               <template v-if="x.value === 'transfer'">
                <q-icon class="on-left" name="attach_money" size="2rem"/>
              </template> -->

              <template v-if="x.value === 'buyrambytes' || x.value === 'sellram'">
                <img style="height: 25px;" type="image/svg+xml" class="on-left" src="statics/ram.svg">
              </template>

              <template v-if="x.value === 'delegatebw' || x.value === 'undelegatebw'">
                <img style="height: 25px;" type="image/svg+xml" class="on-left" src="statics/net.svg">
                <img style="height: 25px;" type="image/svg+xml" class="on-left" src="statics/cpu.svg">
              </template>

              <template v-else>
                <q-icon class="on-left" :name="x.icon" size="2rem"/>
              </template>
<!--
              <template v-if="x.value === 'pushtransaction'">
                <q-icon class="on-left" name="signal_wifi_off" size="2rem"/>
              </template> -->

              <span class="q-body">{{ x.label }}</span>
            </q-btn>

            <q-btn class="col-md-3 col-sm-5 col-xs-10 q-ma-xs" style="height: 50px;" color="amber" v-for="(x, advanced) in advancedFunctions" :key="`advanced${advanced}`" glossy push @click="actionLabel = x.label; actionState = x.value; actionIcon = x.icon; resetStepper()">

              <template>
                <q-icon class="on-left" :name="x.icon" size="2rem"/>
              </template>

              <span class="q-body">{{ x.label }}</span>
            </q-btn>
          </div>

        </template>
        <!-- Stepper Begins -->

        <q-stepper v-else color="secondary" ref="stepper" class="no-shadow" alternative-labels no-header-navigation v-model="currentStep">

          <q-step :active-icon="actionIcon" default name="first" :title="actionLabel">
            <div class="row justify-left scroll">

              <template v-if="actionState === 'transfer'">

                <q-field class="col-3 q-pa-sm" :helper="transfer.fields.to.helper">
                  <q-input :stack-label="transfer.fields.to.label" v-model.trim="transfer.fields.to.default" :placeholder="transfer.fields.to.placeholder"/>
                </q-field>

                <q-field inset="icon" class="col-9 q-pa-sm" :icon="transfer.fields.memo.icon">
                  <q-input :stack-label="transfer.fields.memo.label" v-model.trim="transfer.fields.memo.default" :placeholder="transfer.fields.memo.placeholder" type="textarea" :max-height="20"/>
                </q-field>

                <q-field class="col-9 q-pa-sm" :helper="transfer.fields.quantity.helper">
                  <q-input :stack-label="transfer.fields.quantity.label" v-model.number="transfer.fields.quantity.default" :suffix="transfer.fields.token.default" align="right" type="number" :min="0.0001" :decimals="4" color="primary" />
                </q-field>

                <q-field class="col-3 q-pa-sm" :helper="transfer.fields.token.helper">
                  <q-input :stack-label="transfer.fields.token.label" v-model.trim="transfer.fields.token.default" :placeholder="transfer.fields.token.placeholder"/>
                </q-field>
              </template>

              <template v-if="actionState === 'buyrambytes'">

                <q-field class="col-6 q-pa-sm" :helper="buyrambytes.fields.receiver.helper">
                  <q-input :stack-label="buyrambytes.fields.receiver.label" v-model.trim="buyrambytes.fields.receiver.default" :placeholder="buyrambytes.fields.receiver.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="buyrambytes.fields.bytes.helper">
                  <q-input :stack-label="buyrambytes.fields.bytes.label" v-model.number="buyrambytes.fields.bytes.default" :placeholder="buyrambytes.fields.bytes.placeholder" :suffix="buyrambytes.fields.bytes.label" align="right" type="number" :min="1" :decimals="0" color="primary" />
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ buyrambytes.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'sellram'">

                <q-field class="col-6 q-pa-sm" :helper="sellram.fields.bytes.helper">
                  <q-input :stack-label="sellram.fields.bytes.label" v-model.number="sellram.fields.bytes.default" :placeholder="sellram.fields.bytes.placeholder" :suffix="sellram.fields.bytes.label" align="right" type="number" :min="1" :decimals="0" color="primary" />
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ sellram.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'delegatebw'">
                <q-field class="col-6 q-pa-sm" :helper="delegatebw.fields.from.helper">
                  <q-input :stack-label="delegatebw.fields.from.label" v-model.trim="delegatebw.fields.from.default" :placeholder="delegatebw.fields.from.placeholder"/>
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="delegatebw.fields.receiver.helper">
                  <q-input :stack-label="delegatebw.fields.receiver.label" v-model.trim="delegatebw.fields.receiver.default" :placeholder="delegatebw.fields.receiver.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="delegatebw.fields.stake_net_quantity.helper">
                  <q-input :stack-label="delegatebw.fields.stake_net_quantity.label" v-model.number="delegatebw.fields.stake_net_quantity.default" :placeholder="delegatebw.fields.stake_net_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" color="primary"
                  @input="(delegatebw.fields.stake_net_quantity.default === null) ? delegatebw.fields.stake_net_quantity.default = 0 : delegatebw.fields.stake_net_quantity.default = delegatebw.fields.stake_net_quantity.default"
                  />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="delegatebw.fields.stake_cpu_quantity.helper">
                  <q-input :stack-label="delegatebw.fields.stake_cpu_quantity.label" v-model.number="delegatebw.fields.stake_cpu_quantity.default" :placeholder="delegatebw.fields.stake_cpu_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" color="primary"
                  @input="(delegatebw.fields.stake_cpu_quantity.default === null) ? delegatebw.fields.stake_cpu_quantity.default = 0 : delegatebw.fields.stake_cpu_quantity.default = delegatebw.fields.stake_cpu_quantity.default"
                  />
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ delegatebw.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'undelegatebw'">
                <q-field class="col-6 q-pa-sm" :helper="undelegatebw.fields.from.helper">
                  <q-input :stack-label="undelegatebw.fields.from.label" v-model.trim="undelegatebw.fields.from.default" :placeholder="undelegatebw.fields.from.placeholder"/>
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="undelegatebw.fields.receiver.helper">
                  <q-input :stack-label="undelegatebw.fields.receiver.label" v-model.trim="undelegatebw.fields.receiver.default" :placeholder="undelegatebw.fields.receiver.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="undelegatebw.fields.unstake_net_quantity.helper">
                  <q-input :stack-label="undelegatebw.fields.unstake_net_quantity.label" v-model.number="undelegatebw.fields.unstake_net_quantity.default" :placeholder="undelegatebw.fields.unstake_net_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" color="primary"
                  @input="(undelegatebw.fields.unstake_net_quantity.default === null) ? undelegatebw.fields.unstake_net_quantity.default = 0 : undelegatebw.fields.unstake_net_quantity.default = undelegatebw.fields.unstake_net_quantity.default"
                  />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="undelegatebw.fields.unstake_cpu_quantity.helper">
                  <q-input :stack-label="undelegatebw.fields.unstake_cpu_quantity.label" v-model.number="undelegatebw.fields.unstake_cpu_quantity.default" :placeholder="undelegatebw.fields.unstake_cpu_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" color="primary"
                  @input="(undelegatebw.fields.unstake_cpu_quantity.default === null) ? undelegatebw.fields.unstake_cpu_quantity.default = 0 : undelegatebw.fields.unstake_cpu_quantity.default = undelegatebw.fields.unstake_cpu_quantity.default"
                  />
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ undelegatebw.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'voteproducer'">

                <template v-if="!voteproducer.fields.useProxy.default">
                  <q-field class="col-9 q-pa-sm" :helper="voteproducer.fields.producers.helper">
                  <q-chips-input :stack-label="voteproducer.fields.producers.label" v-model="voteproducer.fields.producers.default" :placeholder="voteproducer.fields.producers.placeholder" />
                  </q-field>
                </template>

                <q-field v-else class="col-9 q-pa-sm" :helper="voteproducer.fields.proxy.helper">
                  <q-input :stack-label="voteproducer.fields.proxy.label" v-model.trim="voteproducer.fields.proxy.default" :placeholder="voteproducer.fields.proxy.placeholder" />
                </q-field>

                <q-field class="col-auto q-pa-sm" :helper="voteproducer.fields.useProxy.helper">
                  <q-toggle v-model="voteproducer.fields.useProxy.default" :label="voteproducer.fields.useProxy.label" color="primary" />
                </q-field>

                <div class="col-12 text-center">
                  <q-field class="col q-pa-sm">
                    <q-btn color="primary" label="Find Block Producers" v-close-overlay @click="$refs.mainContent.$refs.tabs.selectTab('tab-3')" />
                  </q-field>
                </div>
                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ voteproducer.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'pushtransaction'">

                <q-field inset="icon" class="col-9 q-pa-sm" :icon="pushtransaction.fields.transaction.icon">
                  <q-input :stack-label="pushtransaction.fields.transaction.label" v-model.trim="pushtransaction.fields.transaction.default" :placeholder="pushtransaction.fields.transaction.placeholder" type="textarea" :max-height="300" rows="6"/>
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ pushtransaction.helper }}</span>
                </div>

              </template>

              <template v-if="actionState === 'newAccount'">
                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.creator.helper">
                  <q-input :stack-label="newAccount.fields.creator.label" v-model.trim="newAccount.fields.creator.default" :placeholder="newAccount.fields.creator.placeholder"/>
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.name.helper">
                  <q-input :stack-label="newAccount.fields.name.label" v-model.trim="newAccount.fields.name.default" :placeholder="newAccount.fields.name.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.owner.helper">
                  <q-input :stack-label="newAccount.fields.owner.label" v-model.trim="newAccount.fields.owner.default" :placeholder="newAccount.fields.owner.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.active.helper">
                  <q-input :stack-label="newAccount.fields.active.label" v-model.trim="newAccount.fields.active.default" :placeholder="newAccount.fields.active.placeholder" />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.stake_net_quantity.helper">
                  <q-input :stack-label="newAccount.fields.stake_net_quantity.label" v-model.number="newAccount.fields.stake_net_quantity.default" :placeholder="newAccount.fields.stake_net_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" inverted dark color="grey-9" numeric-keyboard-toggle />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.stake_cpu_quantity.helper">
                  <q-input :stack-label="newAccount.fields.stake_cpu_quantity.label" v-model.number="newAccount.fields.stake_cpu_quantity.default" :placeholder="newAccount.fields.stake_cpu_quantity.placeholder" :suffix="$route.meta[$route.params.network].symbol" align="right" type="number" :min="0.0001" :decimals="4" inverted dark color="grey-9" numeric-keyboard-toggle />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.bytes.helper">
                  <q-input :stack-label="newAccount.fields.bytes.label" v-model.number="newAccount.fields.bytes.default" :placeholder="newAccount.fields.bytes.placeholder" :suffix="newAccount.fields.bytes.label" align="right" type="number" :min="1" :decimals="0" inverted dark color="grey-9" numeric-keyboard-toggle />
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="newAccount.fields.transferStake.helper">
                  <q-toggle v-model="newAccount.fields.transferStake.default" :label="newAccount.fields.transferStake.label" color="primary" />
                </q-field>

                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ newAccount.helper }}</span>
                </div>
                <div class="col-12">
                  <q-icon name="info"/>
                  <span class="q-caption" v-html="newAccount.helperTwo"></span>
                </div>
              </template>

              <template v-if="actionState === 'refund'">

                <q-field class="col-6 q-pa-sm" :helper="refund.fields.owner.helper">
                  <q-input :stack-label="refund.fields.owner.label" v-model.trim="refund.fields.owner.default" :placeholder="refund.fields.owner.placeholder"/>
                </q-field>
                <div class="col-12 q-pt-md">
                  <q-icon name="info"/>
                  <span class="q-caption">{{ refund.helper }}</span>
                </div>
              </template>

              <template v-if="actionState === 'updateauth'">
                <q-field class="col-6 q-pa-sm" :helper="updateauth.fields.account.helper">
                  <q-input :stack-label="updateauth.fields.account.label" v-model.trim="updateauth.fields.account.default" :placeholder="updateauth.fields.account.placeholder"/>
                </q-field>

                <q-field class="col-6 q-pa-sm" :helper="updateauth.fields.permission.helper">
                  <q-input :stack-label="updateauth.fields.permission.label" v-model.trim="updateauth.fields.permission.default" :placeholder="updateauth.fields.permission.placeholder" />
                </q-field>
                <q-field class="col-6 q-pa-sm" :helper="updateauth.fields.parent.helper">
                  <q-input :stack-label="updateauth.fields.parent.label" v-model.trim="updateauth.fields.parent.default" :placeholder="updateauth.fields.parent.placeholder" />
                </q-field>
              </template>

            </div>
          </q-step>

          <q-step name="second" active-icon="account_balance_wallet" :title="$t('stepper.connectWallet')">
            <div v-if="!loading" class="row justify-around text-center">
              <span class="col-12 q-title q-mb-lg">{{ $t('stepper.selectDevice') }}</span>

              <q-btn @click="loading = true" class="q-pa-xl col-5">
                <img alt="Ledger logo" style="height: 80px;" type="image/svg+xml" class="col-12" src="statics/ledger.svg">
              </q-btn>

              <q-btn disabled label="Coming Soon" color="grey-4" text-color="grey-9" class="q-pa-xl col-5">
                <img alt="Trezor logo" style="height: 80px;" type="image/svg+xml" class="col-12" src="statics/trezor.svg">
              </q-btn>

            </div>

            <!-- <object v-if="loading" alt="Connect your Ledger" height="300px" type="image/svg+xml" data="statics/connectLedger.svg" style="margin-left: auto; margin-right: auto; display: block; margin-top: -22px"/> -->

            <object v-if="loading" ref="approveTransaction" type="image/svg+xml" height="200px" data="statics/approveTransaction.svg" style="margin-left: auto; margin-right: auto; display: block; margin-top: 10px"/>
          </q-step>

          <q-step name="third" active-icon="send" :title="$t('stepper.approve')" :error="(txId === '' && !responseEmpty)">
            <object v-if="responseEmpty" ref="approveTransaction" type="image/svg+xml" height="200px" data="statics/approveTransaction.svg" style="margin-left: auto; margin-right: auto; display: block; margin-top: 10px"/>

            <div v-else class="row justify-around text-center q-my-sm">
              <template v-if="txId !== ''">
                <span class="col-12 q-title q-mb-lg text-positive">{{ $t('transactions.success') }}</span>
                <span class="col-12 break-n-wrap q-subtitle q-mb-lg">{{ $t('transactions.txId', [txId]) }}</span>
              </template>
              <template v-else>
                <span class="col-12 q-title q-mb-lg text-negative">{{ $t('transactions.failed') }}</span>
                <span class="col-12 q-subtitle q-mb-lg">{{ txFailed }}</span>
              </template>
            </div>

            <raw-viewer v-if="!responseEmpty" :titleOne="$t('raw.signedTx')" :titleTwo="$t('raw.netResponse')" :JSONOne="pendingTransaction" :JSONTwo="responseData"/>
          </q-step>

       </q-stepper>

        <q-toolbar slot="footer" color="grey-3">
          <q-toolbar-title>

            <q-stepper-navigation>

              <q-btn v-if="currentStep === 'first' && actionState"
                color="deep-purple"
                @click="processAction()"
                :label="$t('stepper.buttons.validate')"
              />

              <template v-if="currentStep === 'second'">
                <q-btn
                  color="black"
                  inverted flat
                  @click="resetStepper()"
                  :label="$t('stepper.buttons.cancel')"
                />
              </template>

              <template v-if="currentStep === 'third'">
                <q-btn v-if="!responseEmpty"
                  color="primary"
                  class="on-left"
                  @click="resetStepper(true)"
                  :label="$t('stepper.buttons.createNew')"
                />
                <q-btn v-if="txId !== ''" outline icon="link" color="deep-purple" :label="$t('stepper.buttons.viewTX', [`${$route.meta[$route.params.network].blockExplorer.replace(/https?:\/\/(www.)?/gi,'').split(/[/?#]/)[0]}`])" @click="openURL(`${$route.meta[$route.params.network].blockExplorer}${txId}`)"/>
              </template>
            </q-stepper-navigation>

          </q-toolbar-title>
        </q-toolbar>

      </q-modal-layout>
    </q-modal>
  </q-page>
</template>

<script>
import accountHeader from 'components/account-header.vue'
import mainContent from 'components/main-content.vue'
import meowApi from 'components/utils/meow-api.vue'
// import performAction from 'components/perform-action.vue'
import rawViewer from 'components/raw-viewer.vue'
import approveTransaction from 'components/approve-transaction.vue'
import { openURL } from 'quasar'

import TransportU2F from '@ledgerhq/hw-transport-u2f' // Stock Ledger Transport
import LedgerEos from 'assets/EosLedger.js' // https://github.com/altShiftDev/eosledgerjs
import Eos from 'eosjs'
// import eContract from 'components/e-contract.vue'

const DecimalPad = Eos.modules.format.DecimalPad
const ecc = Eos.modules.ecc

const dPath = {
  assumed: "44'/194'/0'/0/",
  urlProvided: ''
}

async function ledgerAPI () {
  const transport = await TransportU2F.create()
  return new LedgerEos(transport)
}

const signTransaction = async (val, tx) => {
  let location = (typeof val === 'string') ? val : `${dPath.assumed}${val}`
  console.log(`attempting to sign at ${location}`)
  const ledger = await ledgerAPI()
  const result = await ledger.signTransaction(location, tx)
  if (typeof result === 'string') {
    // check if result is a string - if string then it's an error message
    console.log('result', result)
    return result
  }
  // console.log(result)
  let formattedSig = ecc.Signature.from(result.v + result.r + result.s)
  // console.log(`formattedSig ${formattedSig}`)
  return formattedSig
}

export default {
  name: 'account',
  components: {
    accountHeader,
    mainContent,
    rawViewer,
    approveTransaction,
    meowApi
  },
  props: ['defaultAPI'],
  data () {
    return {
      account_name: this.$route.params.accountName,
      actionLabel: this.$t('eosAPI.select'),
      actionState: false,
      actionIcon: 'attach_money',
      currentStep: 'first',
      accountData: {},
      settings: {
        showAirdrops: (this.$route.meta[this.$route.params.network].chain === 'EOS'),
        showUSD: false
      },
      isProxy: false,
      isProducer: false,
      historyData: [],
      bpList: [],
      tokenData: false,
      pendingTransaction: {},
      responseData: {},
      txId: '',
      txFailed: '',
      totalWeight: '',
      resources: {
        refund: false,
        cpuWeight: 0,
        netWeight: 0,
        cpuRefund: 0,
        netRefund: 0,
        liquid: 0,
        cpuStakeHelper: '',
        netStakeHelper: '',
        cpuTotal: 0,
        netTotal: 0,
        airdrops: 0
      },
      loading: false,
      eosPrice: {
        USD: null,
        dailyChange: null,
        ramEOS: null,
        ramUSD: null
      },
      modalOpen: false,
      modalMaximized: false,
      errorLabels: {
        required: 'This field is required',
        minimumRAM: 'Minimum of 1 Byte of RAM',
        minimumEOS: `Minimum of 0.0001 ${this.$route.meta[this.$route.params.network].symbol}`
      },
      transfer: {
        icon: 'attach_money',
        fields: {
          from: {
            label: 'Sender',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          to: {
            label: 'Receiver',
            default: '',
            placeholder: '',
            error: false,
            helper: ''
          },
          quantity: {
            label: 'Quantity',
            default: 1.0000,
            placeholder: '',
            error: false,
            helper: '',
            icon: 'attach_money'
          },
          token: {
            label: 'Token',
            default: this.$route.meta[this.$route.params.network].symbol,
            placeholder: '',
            error: false,
            helper: 'Make sure to select a token you actually have or the transaction will fail'
          },
          memo: {
            label: 'Memo',
            default: '',
            placeholder: 'Sent with my Ledger Nano S from altShiftDev.com!',
            error: false,
            helper: 'Memo\'s are usually optional but if you\'re sending money to a contract or exchange it may be a required field',
            icon: 'add_comment'
          }
        }
      },
      refund: {
        icon: 'undo',
        fields: {
          owner: {
            label: 'Owner',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: `This is a fallback function if your refund request does not complete automatically when unstaking ${this.$route.meta[this.$route.params.network].symbol}.`
          }
        },
        helper: 'You can\'t use this function until 72h have passed from the last unstake attempt.'

      },
      newAccount: {
        fields: {
          creator: {
            label: 'Creator',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          name: {
            label: 'New account name',
            default: '',
            placeholder: 'mynewaccount',
            error: false,
            helper: 'Account names should be 12 characters using only lowercase [“a-z”] and numbers [“1-5”]'
          },
          owner: {
            label: 'Owner',
            default: '',
            placeholder: 'EOS5tJQS...',
            error: false,
            helper: 'Public key for the @owner permission of the new account'
          },
          active: {
            label: 'Active',
            default: '',
            placeholder: 'EOS5tJQS...',
            error: false,
            helper: 'Public key for the @active permission of the new account'
          },
          bytes: {
            label: 'Bytes',
            default: 4096,
            placeholder: '4096',
            error: false,
            helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B (4 KB) of RAM for a new account but 8192 B (8 KB) is safer.'
          },
          stake_net_quantity: {
            label: 'Network Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            error: false,
            helper: `A stake of 0.001 to 0.1 would allow you to make about 1 transaction per day. A stake of 1 ${this.$route.meta[this.$route.params.network].symbol} allows you to make several transactions per minute.`
          },
          stake_cpu_quantity: {
            label: 'CPU Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            error: false,
            helper: `A stake of 0.001 to 0.1 would allow you to make about 1 transaction per day. A stake of 1 ${this.$route.meta[this.$route.params.network].symbol} allows you to make several transactions per minute.`
          },
          transferStake: {
            label: 'Transfer Stake To New Account',
            default: true,
            error: false,
            helper: `If checked, the stake belongs to newly created account. If unchecked, the stake belongs to the creator.`
          }
        },
        helper: `A newly created account will need some ${this.$route.meta[this.$route.params.network].symbol} staked for CPU and Network and a few KBs of RAM before it can interact with the blockchain.`,
        helperTwo: 'It\'s possible to create an account with less than 12 characters but only if you\'ve won a premium name auction. You can find out more about premium account names here: <a target="_blank" href="https://github.com/EOSIO/eos/issues/3189">Github Issue 3189</a>'
      },
      updateauth: {
        fields: {
          account: {
            label: 'Username',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          permission: {
            label: 'permission',
            default: 'active',
            placeholder: 'active or owner',
            error: false,
            helper: 'Which permission do you want to change?'
          },
          parent: {
            label: 'owner',
            default: 'owner',
            placeholder: '',
            error: false,
            helper: 'owner'
          }
        }
      },
      buyrambytes: {
        fields: {
          payer: {
            label: 'Payer',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          receiver: {
            label: 'Receiver',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          bytes: {
            label: 'Bytes',
            default: 1024,
            placeholder: '1024',
            error: false,
            helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B (4 KB) of RAM for your account but 8192 B (8 KB) is safer.'
          }
        },
        helper: `The prices fluctuate based on supply and demand so you should research the price of RAM before running this function as it may cost you more ${this.$route.meta[this.$route.params.network].symbol} than you expect.`
      },
      sellram: {
        fields: {
          account: {
            label: 'Seller',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          bytes: {
            label: 'Bytes',
            default: 1024,
            placeholder: '1024',
            error: false,
            helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B (4 KB) of RAM for your account but 8192 B (8 KB) is safer.'
          }
        },
        helper: `The prices fluctuate based on supply and demand so you should research the price of RAM before running this function as you may not receive as much ${this.$route.meta[this.$route.params.network].symbol} as you expect for your RAM.`
      },
      delegatebw: {
        fields: {
          from: {
            label: 'Staker',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          receiver: {
            label: 'Receiver',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: 'Put your account name here if you\'re adjusting your own stake, otherwise the account you\'re delegating to.'
          },
          stake_net_quantity: {
            label: 'Network Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            error: false,
            helper: ''
          },
          stake_cpu_quantity: {
            label: 'CPU Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            error: false,
            helper: ''
          }
        },
        helper: `A stake of 0.001 to 0.1 would allow you to make about 1 transaction per day. A stake of 1 ${this.$route.meta[this.$route.params.network].symbol} allows you to make several transactions per minute.`
      },
      undelegatebw: {
        fields: {
          from: {
            label: 'Staker',
            default: this.$route.params.accountName,
            placeholder: '',
            helper: ''
          },
          receiver: {
            label: 'Receiver',
            default: this.$route.params.accountName,
            placeholder: '',
            helper: 'Put your account name here if you\'re adjusting your own stake, otherwise the account you\'re delegating to.'
          },
          unstake_net_quantity: {
            label: 'Network Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            helper: ''
          },
          unstake_cpu_quantity: {
            label: 'CPU Stake Quantity',
            default: 1.0000,
            placeholder: '1.0000',
            helper: ''
          }
        },
        helper: `A stake of 0.001 to 0.1 would allow you to make about 1 transaction per day. A stake of 1 ${this.$route.meta[this.$route.params.network].symbol} allows you to make several transactions per minute.`
      },
      voteproducer: {
        fields: {
          from: {
            label: 'Voter',
            default: this.$route.params.accountName,
            placeholder: '',
            helper: ''
          },
          proxy: {
            label: 'Voting Proxy',
            default: '',
            placeholder: '',
            helper: 'Put the name of a voting proxy here if you want to assign them your voting rights.'
          },
          useProxy: {
            label: 'Use a voting proxy?',
            default: false,
            placeholder: '',
            helper: ''
          },
          producers: {
            label: 'Block Producers',
            default: [],
            placeholder: '',
            helper: 'You can vote for up to 30 block producers.'
          }
        },
        helper: 'Your voting power will diminish overtime so it\'s important to keep renewing your vote to maintain it\'s full power and to adjust your list of block producers based on their performance.'
      },
      pushtransaction: {
        fields: {
          transaction: {
            label: 'Signed Transaction',
            default: '',
            placeholder: '',
            helper: ''
          }
        },
        helper: 'You can push an offline transaction that you\'ve previously signed, you do not need a hardware wallet!'
      }
    }
  },
  methods: {
    openURL,
    getAccount (account) {
      this.loading = true
      let payload = { account_name: account }
      this.$eos.getAccount(payload)
        .then(r => {
          this.loading = false
          this.accountData = r
          this.processAccount(r)
        })
        .catch(e => {
          this.loading = false
          this.handleFailure(e)
          console.log(e)
        })
    },
    processAccount (data) {
      let refund = (data.refund_request && data.total_resources !== null)
      let totalResources = (data.total_resources && data.total_resources !== null)
      let liquidBalance = (data.core_liquid_balance && data.core_liquid_balance !== null)

      let cpu = totalResources && data.total_resources.cpu_weight ? data.total_resources.cpu_weight.split(' ') : [0]
      let cpuWeight = Number(cpu[0])

      let net = totalResources && data.total_resources.net_weight ? data.total_resources.net_weight.split(' ') : [0]
      let netWeight = Number(net[0])

      let cRefund = refund ? data.refund_request.cpu_amount.split(' ') : [0]
      let cpuRefund = Number(cRefund[0])

      let nRefund = refund ? data.refund_request.net_amount.split(' ') : [0]
      let netRefund = Number(nRefund[0])

      let l = liquidBalance ? data.core_liquid_balance.split(' ') : [0]
      let liquid = Number(l[0])

      let cpuStakeHelper = `My current CPU stake is ${cpuWeight} ${this.$route.meta[this.$route.params.network].symbol}`
      let netStakeHelper = `My current Network stake is ${netWeight} ${this.$route.meta[this.$route.params.network].symbol}`

      this.resources = {
        refund: refund,
        cpuWeight: cpuWeight,
        netWeight: netWeight,
        cpuRefund: cpuRefund,
        netRefund: netRefund,
        liquid: liquid,
        cpuStakeHelper: cpuStakeHelper,
        netStakeHelper: netStakeHelper,
        cpuTotal: (cpuWeight + cpuRefund),
        netTotal: (netWeight + netRefund),
        airdrops: this.resources.airdrops
      }

      if (this.accountData.voter_info !== null) {
        this.voteproducer.fields.useProxy.default = (this.accountData.voter_info.proxy.length > 0)
        this.voteproducer.fields.proxy.default = this.accountData.voter_info.proxy
        this.voteproducer.fields.producers.default = this.accountData.voter_info.producers
        this.isProxy = (this.accountData.voter_info.is_proxy)
      }

      this.delegatebw.fields.stake_cpu_quantity.helper = cpuStakeHelper
      this.undelegatebw.fields.unstake_cpu_quantity.helper = cpuStakeHelper
      this.delegatebw.fields.stake_net_quantity.helper = netStakeHelper
      this.undelegatebw.fields.unstake_net_quantity.helper = netStakeHelper
    },
    getHistory (account, pos = -1, offset = -200) {
      this.loading = true
      this.$eos.getActions(account, pos, offset)
        .then(r => {
          this.loading = false
          let sorted = r.actions.sort(this.numericalSort)
          let unique = sorted.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj.action_trace.trx_id).indexOf(obj.action_trace.trx_id) === pos
          })
          this.historyData = unique
        })
        .catch(e => {
          this.loading = false
          console.log(e)
        })
    },
    async getTokens (account) {
      if (this.inTheJungle) {
        console.log('tokens return')
        this.tokenData = []
        return
      }
      this.loading = true
      // cypherblockapi api
      let payload = {
        query:
          `{
            eosmarketcap(limit: "1000") {
              data {
                label: currency
                contract
                value: currency
                change
                supply {
                  current
                  max
                }
                price: last
                volume
              }
            }
          }`
      }
      let cors = 'https://cors-anywhere.herokuapp.com/'
      let base = 'https://www.cypherblock.io/graphql'
      let apiOne = cors + base
      let z
      try {
        z = await this.$axios.post(apiOne, payload)
        z = z.data.data.eosmarketcap.data
        for (let x of z) {
          // if (x.value === 'BLACK') {
          //   // console.log(x)
          // }
          x.usd_value = Number(x.price * this.eosPrice.USD)
        }
      }
      catch (e) {
        console.log('graphql failed', e)
      }

      // eosrio api
      let baseUrl = 'https://hapi.eosrio.io/data/tokens/'
      let apiTwo = baseUrl + account

      try {
        let r = await this.$axios.get(apiTwo)
        this.loading = false
        let current = 0
        let arr = Object.entries(r.data).map(([k, v]) => ({
          contract: k,
          label: v.symbol,
          sublabel: `${v.balance.toFixed(v.precision).toString()} ${v.symbol}`,
          avatar: `statics/icons/${v.symbol.toLowerCase()}.png?v=1`,
          inset: true,
          value: v.symbol,
          precision: v.precision || 0,
          balance: v.balance,
          price: v.price,
          usd_value: v.usd_value
        }))

        for (let a of arr) {
          let b = z.filter(z => (a.contract === z.contract && a.value === z.value && z.supply.max !== '0'))
          if (b.length === 1) {
            b = b[0]
            a.price = b.usd_value
            a.usd_value = a.balance * b.usd_value
          }
        }
        this.tokenData = arr
        for (var x of this.tokenData) {
          if (x.price) {
            current = x.usd_value + current
          }
        }
        let str = (current / this.eosPrice.USD).toFixed(current >= 1 ? 4 : 6)
        this.resources.airdrops = Number(str)
      }

      catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getProducers (account) {
      let r = await this.$eos.getProducers({
        'json': true,
        'scope': 'eosio',
        'code': 'eosio',
        'table': 'global',
        'limit': 100
      })
      this.totalWeight = r.total_producer_vote_weight

      this.bpList = r.rows
      let search = this.bpList.filter(x => (x.owner === account))
      this.isProducer = (search.length > 0)
    },
    async getProposals () {
      // get_table_rows -d '{"json":true,"code":"cancancan123","scope":"eoscanadacom","table":"vote","index_position":2,"key_type":"i128","lower_bound":"0x000000000000000090E9BC74EAA5B669","upper_bound":"0xFFFFFFFFFFFFFFFF90E9BC74EAA5B669"}'
      let r = await this.$eos.getTableRows({
        'json': true,
        'scope': 'eosio.forum',
        'code': 'eosio.forum',
        'table': 'proposal',
        // 'index_position': 3,
        // 'key_type': 'i128',
        'limit': 1000
        // 'lower_bound': '0x00000000000000000000000084AB32DD',
        // 'uppper_bound': '0xFFFFFFFFFFFFFFFF0000000084AB32DD'
      })
      console.log('pollData', r)
      // this.totalWeight = r.total_producer_vote_weight

      // this.pollList = r.rows
      // let search = this.bpList.filter(x => (x.owner === account))
      // this.isProducer = (search.length > 0)
    },
    // async getTicker () {
    //   let r = await this.$eos.getTableRows({
    //     'json': true,
    //     'scope': 'eosriooracle',
    //     'code': 'eosriooracle',
    //     'table': 'ticker',
    //     'limit': 10
    //   })
    //   // get table eosriooracle eosriooracle ticker
    //   // let ticker = r.rows[0]
    //   console.log('ticker response', r)
    // },
    async getRamCost () {
      let r = await this.$eos.getTableRows({
        'json': true,
        'scope': 'eosio',
        'code': 'eosio',
        'table': 'rammarket',
        'limit': 10
      })
      // this.Ram = r.rows.map(v => ({
      //   owner: v.owner,
      //   votes: v.total_votes,
      //   url: v.url
      // }))
      let ram = r.rows[0]
      let ramQuoteBalance = ram.quote.balance.substr(0, ram.base.balance.indexOf(' '))
      let ramBaseBalance = ram.base.balance.substr(0, ram.base.balance.indexOf(' '))

      this.eosPrice.ramEOS = ((ramQuoteBalance / ramBaseBalance) * 1024).toFixed(4) // Price in KiB
      this.eosPrice.ramUSD = (this.eosPrice.ramEOS * this.eosPrice.USD).toFixed(4)
      // console.log('ramPriceEOS', ramPriceEOS)
      // console.log('ramPriceUSD', ramPriceUSD)
    },
    async getPrice (account) {
      if (this.inTheJungle) {
        // this.tokenData = []
        // return
      }
      // let cors = 'https://cors-anywhere.herokuapp.com/'
      // let baseUrl = 'https://api.bitfinex.com/v2/ticker/tEOSUSD'
      // let apiUrl = cors + baseUrl
      let apiUrl = 'https://api.coinmarketcap.com/v2/ticker/1765/'
      let r = await this.$axios.get(apiUrl)
      // console.log(r.data.data.quotes)
      this.eosPrice.USD = r.data.data.quotes.USD.price
      this.eosPrice.dailyChange = r.data.data.quotes.USD.percent_change_1h
      this.getRamCost()
      this.getTokens(account)
      // this.$axios.get(apiUrl)
      //   .then(r => {
      //     // this.price = r.data[0]
      //     // this.dailyChange = r.data[5]
      //     // console.log(r.data.data.quotes.USD.price)
      //     this.price = r.data.data.quotes.USD.price

      //   })
      // .catch(e => {
      //   console.log('bitfinex api is having some issues so we can\'t get the price of eos', e)
      // })
    },
    processAction (label, action) {
      if (!label && !action) {
        if (this.actionState === 'transfer') {
          let payload = {
            from: this.transfer.fields.from.default,
            to: this.transfer.fields.to.default,
            quantity: DecimalPad(this.transfer.fields.quantity.default, 4) + ' ' + this.transfer.fields.token.default.toUpperCase(),
            memo: this.transfer.fields.memo.default
          }
          this.transferTokens(payload)
          return
        }
        if (this.actionState === 'newAccount') {
          let payload = {
            creator: this.newAccount.fields.creator.default,
            name: this.newAccount.fields.name.default,
            owner: this.newAccount.fields.owner.default,
            active: this.newAccount.fields.active.default,
            bytes: this.newAccount.fields.bytes.default,
            stake_net_quantity: `${DecimalPad(this.newAccount.fields.stake_net_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            stake_cpu_quantity: `${DecimalPad(this.newAccount.fields.stake_cpu_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            transfer: this.newAccount.fields.transferStake.default
          }
          this.createAccount(payload)
          return
        }
        if (this.actionState === 'buyrambytes') {
          let payload = {
            payer: this.buyrambytes.fields.payer.default,
            receiver: this.buyrambytes.fields.receiver.default,
            bytes: this.buyrambytes.fields.bytes.default
          }
          this.buyRam(payload)
          return
        }
        if (this.actionState === 'sellram') {
          let payload = {
            account: this.sellram.fields.account.default,
            bytes: this.sellram.fields.bytes.default
          }
          this.sellRam(payload)
          return
        }
        if (this.actionState === 'delegatebw') {
          let payload = {
            from: this.delegatebw.fields.from.default,
            receiver: this.delegatebw.fields.receiver.default,
            stake_net_quantity: `${DecimalPad(this.delegatebw.fields.stake_net_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            stake_cpu_quantity: `${DecimalPad(this.delegatebw.fields.stake_cpu_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            transfer: 0
          }
          this.increaseStake(payload)
          return
        }
        if (this.actionState === 'undelegatebw') {
          let payload = {
            from: this.undelegatebw.fields.from.default,
            receiver: this.undelegatebw.fields.receiver.default,
            unstake_net_quantity: `${DecimalPad(this.undelegatebw.fields.unstake_net_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            unstake_cpu_quantity: `${DecimalPad(this.undelegatebw.fields.unstake_cpu_quantity.default, this.$route.meta[this.$route.params.network].precision)} ${this.$route.meta[this.$route.params.network].symbol}`,
            transfer: 0
          }
          this.decreaseStake(payload)
        }
        if (this.actionState === 'voteproducer') {
          let payload = {
            voter: this.voteproducer.fields.from.default,
            proxy: this.voteproducer.fields.useProxy.default ? this.voteproducer.fields.proxy.default : '',
            producers: this.voteproducer.fields.useProxy.default ? [] : this.voteproducer.fields.producers.default // arr.sort(this.alphaSort)
            // EOS requires the array of producers to be sorted and unique'd before sending or the tx will fail
          }
          this.vote(payload)
        }
        if (this.actionState === 'pushtransaction') {
          let string = this.pushtransaction.fields.transaction.default
          // console.log(typeof payload)
          let payload = JSON.parse(string)
          this.pushTransaction(payload)
        }
        if (this.actionState === 'updateauth') {
          let pubkey = 'test'
          let auth = {
            threshold: 1,
            accounts: [
              {
                permission: {
                  actor: 'inita',
                  permission: 'active'
                },
                weight: 1
              }
            ],
            keys: [
              {
                key: pubkey,
                weight: 1
              }
            ]
          }
          let payload = {
            account: this.updateauth.fields.account.default,
            permission: this.updateauth.fields.permission.default,
            parent: this.updateauth.fields.parent.default,
            auth: auth
          }
          this.updateAuth(payload)
        }

        if (this.actionState === 'refund') {
          let payload = {
            owner: this.refund.fields.owner.default
          }
          this.refundCommand(payload)
        }

        if (this.actionState === 'chintailease') {
          let payload = {
            memo: 'altshiftdeva|0|0.0040|0.1000|7|sh0z7gjill',
            from: 'altshiftdeva',
            quantity: '0.0040 EOS'
          }
          this.chintaiLease(payload)
        }
      }
      // else {
      //   let camelCase = label.replace(/_([a-z])/gi, function ($0, $1) { return $1.toUpperCase() })
      //   let payload = action.params === null ? {} : action.params
      //   this.$eos[camelCase](payload)
      //     .then(r => {
      //       console.log(r)
      //     })
      //     .catch(e => console.log(e))
      // }
    },
    // getAccountFromPub (publicKey) {
    //   let payload = { public_key: publicKey }
    //   this.$eos.getKeyAccounts(payload) // EOS API to find accounts for a particular public key
    //     .then(r => {
    //       let accounts = r.account_names
    //       if (accounts.length > 0) { // Found valid accounts in network response
    //         for (var x of accounts) {
    //           console.log('x', x)
    //           this.accountNames.push(x)
    //         }
    //         this.loading = false
    //         this.loadingMsg = `Found ${this.$route.meta.chain} account(s) at ${publicKey}`
    //       }
    //       else { // no accounts found for the provided keys
    //         this.loadingMsg = `No ${this.$route.meta.chain} account(s) found - Try changing your derivation path`
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    // },
    resetStepper (fullReset) {
      this.txId = ''
      this.txFailed = ''
      this.responseData = {}
      this.pendingTransaction = {}
      this.loading = false
      if (fullReset) {
        this.actionState = false
        this.actionLabel = this.$t('eosAPI.select')
      }
      else {
        this.$nextTick(function () {
          this.$refs.stepper.reset()
        })
      }
    },
    transferTokens (p) {
      console.log('transferToken API Payload:', p)
      this.$eos.transfer(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    chintaiLease (p) {
      console.log('Chintai Order API Payload:', p)
      /* eslint camelcase: 0 */ // --> OFF
      let options = { authorization: [`${this.account_name}@active`] }
      this.$eos.transaction(['chintailease', 'eosio.token'], ({chintailease, eosio_token}) => {
        chintailease.prepare(p.memo, options) // needs to be 1st
        eosio_token.transfer(p.from, 'chintailease', p.quantity, p.memo, options) // needs to be 2nd
        chintailease.activate(p.memo, options) // needs to be 3rd
      }, { broadcast: false, sign: false })
        .then(r => {
          console.log(r)
          this.handleSuccess(r)
        })
        .catch(e => {
          console.log(e)
          this.handleFailure(e)
        })

        // "transaction declares authority '{"actor":"altshiftdevy","permission":"active"}', but does not have signatures for it under a provided delay of 0 ms, provided permissions [], provided keys ["EOS7i91PmRtxhKEiJ9kynP1PUvKsBUL5xZJpGvk4Rbyf4eCnz1vr6"], and a delay max limit of 3888000000 ms"

        // "transaction declares authority '{"actor":"altshiftdevy","permission":"active"}', but does not have signatures for it under a provided delay of 0 ms, provided permissions [], provided keys ["EOS7aKMFTF4gmPxDBS6Ysa7TUBB56AJ1cQzTixVofrZQK44Wz57DR"], and a delay max limit of 3888000000 ms"

        // "transaction declares authority '{"actor":"altshiftdevy","permission":"active"}', but does not have signatures for it under a provided delay of 0 ms, provided permissions [], provided keys ["EOS5ShdYbLaCdjSMXhDo6DMzcMzixRAK959dCRg1cCmAwJUAqYnDb"], and a delay max limit of 3888000000 ms"
    },
    createAccount (p) {
      console.log('createAccount API Payload:', p)
      this.$eos.transaction(tr => {
        tr.newaccount({
          creator: p.creator,
          name: p.name,
          owner: p.owner,
          active: p.active
        })
        tr.buyrambytes({
          payer: p.creator,
          receiver: p.name,
          bytes: p.bytes
        })
        tr.delegatebw({
          from: p.creator,
          receiver: p.name,
          stake_net_quantity: p.stake_net_quantity,
          stake_cpu_quantity: p.stake_cpu_quantity,
          transfer: p.transfer ? 1 : 0
        })
      }, { broadcast: false, sign: false })
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    buyRam (p) {
      console.log('buyRam API Payload:', p)
      this.$eos.buyrambytes(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    sellRam (p) {
      console.log('sellram API Payload:', p)
      this.$eos.sellram(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    increaseStake (p) {
      console.log('increaseStake API Payload:', p)
      this.$eos.delegatebw(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    decreaseStake (p) {
      console.log('decreaseStake API Payload:', p)
      this.$eos.undelegatebw(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    vote (p) {
      console.log('voteproducer API Payload:', p)
      this.$eos.voteproducer(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    updateAuth (p) {
      console.log('updateAuth API Payload:', p)
      this.$eos.updateauth(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    refundCommand (p) {
      console.log('refund API Payload:', p)
      this.$eos.refund(p)
        .then(r => this.handleSuccess(r))
        .catch(e => this.handleFailure(e))
    },
    needsChrome () {
      this.$q.notify({
        type: 'info',
        message: this.$t('notifications.needChrome')
      })
    },
    prepareVote (arr) {
      if (!this.$q.platform.is.chrome && !this.$q.platform.is.opera) {
        this.needsChrome()
        return
      }
      arr = arr.map(v => (v.owner))
      this.voteproducer.fields.useProxy.default = false
      this.voteproducer.fields.producers.default = arr.sort(this.alphaSort)
      this.actionState = 'voteproducer'
      this.actionIcon = 'how_to_vote'
      this.modalOpen = true
    },
    updateSettings (settings) {
      this.settings = settings
    },
    modifyRam () {
      if (!this.$q.platform.is.chrome && !this.$q.platform.is.opera) {
        this.needsChrome()
        return
      }
      this.actionState = 'buyrambytes'
      this.modalOpen = true
    },
    modifyStake () {
      if (!this.$q.platform.is.chrome && !this.$q.platform.is.opera) {
        this.needsChrome()
        return
      }
      this.actionState = 'delegatebw'
      this.modalOpen = true
    },
    alphaSort (a, b, comp = 0) {
      if (a < b) {
        comp = -1
      }
      else if (b < a) {
        comp = +1
      }
      return comp
    },
    numericalSort (a, b, comp = 0) {
      if (a.account_action_seq > b.account_action_seq) {
        comp = -1
      }
      else if (b.account_action_seq > a.account_action_seq) {
        comp = +1
      }
      return comp
    },
    updateAnimation () {
      let img = this.$refs.approveTransaction
      // console.log('svg', img)
      let svgDOM = img.contentDocument
      // console.log('svgDOM', svgDOM)
      let item = svgDOM.getElementById('el_s258zBZFmvg')
      // console.log(item)
      let label = DecimalPad(this.transfer.fields.quantity.default, 4) + ' ' + this.transfer.fields.token.default.toUpperCase()
      item.textContent = (this.actionState === 'transfer') ? 'Send ' + label : this.actionLabel
    },
    handleSuccess (r) {
      this.$refs.stepper.next()
      console.log('Unsigned TX Received:', r.transaction)
      this.pendingTransaction = r.transaction
      this.responseData = {}
    },
    async signTX (useHash = false) {
      let tx = this.pendingTransaction
      this.pendingTransaction = tx

      const ledger = await ledgerAPI()
      const buffer = await ledger.serialize(tx, this.$eos.config.chainId, this.$eos.fc.types)
      const response = await signTransaction(dPath.urlProvided || 0, buffer.toString('hex'))

      if (typeof response === 'string') {
        // handle errors from the device
        this.handleFailure(response, true)
        this.responseData = { 'error': response }
        this.txId = ''
        this.$refs.stepper.next()
        this.loading = false
        return
      }

      this.titleOne = this.$t('raw.signedTx')
      tx.signatures.push(response.toString())
      this.pushTransaction(tx)
    },
    async pushTransaction (tx) {
      console.log('pushTransaction API Payload:', tx)
      // this.$eos.pushTransaction(p)
      //   .then(r => console.log(r))
      //   .catch(e => this.handleFailure(e))

      try {
        // attempt to push the tx to the network
        let r = await this.$eos.pushTransaction(tx)
        console.log(r)
        this.$refs.stepper.goToStep('third')
        this.responseData = r // Response data is shown in the UI's json viewer
        this.txId = r.transaction_id
        this.initialize() // Since a tx has been made, get new account balance, history, etc...
      }
      catch (e) {
        console.log(e)
        // Handle failures from the network
        this.handleFailure(e)
        this.responseData = e
        this.txId = ''
        this.$refs.stepper.goToStep('third')
        this.loading = false
      }
    },
    handleFailure (e, alreadyProcessed = false, userError = []) {
      console.log('e', typeof e, e)
      try {
        if (!alreadyProcessed) {
          // Attempt to process error
          let cleanErr = e.toString().replace('Error: ', '')
          const obj = JSON.parse(cleanErr)

          obj.error.details.forEach(d => {
            userError.push(d.message)
          })
        }
        else {
          // Error is already processed by another function, just display it
          userError[0] = e
        }
        console.log('userError', userError) // full error array
        let err = this.alertError(userError[0]) // in 99% of cases only the first error is useful
        this.txFailed = err
        this.$q.notify(err) // Notify user of error a long with custom, user-friendly error messages
      }
      catch (ee) {
        console.error(ee)
        if (userError.length === 0) {
          userError.push('Unknown error')
        }
        this.txFailed = 'Unknown error'
        this.$q.notify(this.$t('errors.unknownError'))
      }
    },
    alertError (e) {
      // This is my error handler, it works with vue-i18n (localizer plugin) to provide friendlier and translated error messages than is typical from the network response.
      // The full error notifications can be found in /src/i18n/en-us/index.js
      if (e.toLowerCase().includes('unknown key')) {
        return this.$t('errors.noAccount')
      }
      if (e.toLowerCase().includes('to account does not exist')) {
        return this.$t('errors.noToAccount')
      }
      if (e.toLowerCase().includes('expired transaction')) {
        return this.$t('errors.expired')
      }
      if (e.toLowerCase().includes('action\'s authorizing actor \'')) {
        return this.$t('errors.fromInvalid')
      }
      if (e.toLowerCase().includes('transaction declares authority \'{"actor":"')) {
        return this.$t('errors.notYourAccount')
      }
      if (e.toLowerCase().includes('overdrawn balance')) {
        return this.$t('errors.noFunds')
      }
      if (e.toLowerCase().includes('must purchase a positive amount') || e.toLowerCase().includes('token amount received from selling eos-ram.vue is too low')) {
        return this.$t('errors.tooSmall')
      }
      if (e.toLowerCase().includes('unable to find key')) {
        return this.$t('errors.notRealToken')
      }
      if (e.toLowerCase().includes('no balance object found')) {
        return this.$t('errors.notYourToken')
      }
      if (e.toLowerCase().includes('cannot transfer to self')) {
        return this.$t('errors.sentToSelf')
      }
      if (e.toLowerCase().includes('billed CPU time')) {
        return this.$t('errors.outOfCPU')
      }
      if (e.toLowerCase().includes('user must stake before they can vote')) {
        return this.$t('errors.cantVoteYet')
      }
      if (e.toLowerCase().includes('refund request not found')) {
        return this.$t('errors.noRefund')
      }
      if (e.toLowerCase().includes('duplicate transaction')) {
        let tx = e.split(' ')
        return this.$t('errors.duplicate', [tx[2]])
      }

      // Ledger Specific Errors:
      if (e.toLowerCase().includes('hash signing not allowed')) {
        return this.$t('errors.hashSigning')
      }
      if (e.toLowerCase().includes('transaction approval request was rejected') || e.toLowerCase().includes('denied by the user')) {
        return this.$t('errors.txRejected')
      }
      if (e.toLowerCase().includes('detected a non-hardened path element')) {
        return this.$t('errors.nonHardened')
      }
      if (e.toLowerCase().includes('u2f timeout')) {
        return this.$t('errors.timeout')
      }
      if (e.toLowerCase().includes('invalid data received')) {
        return this.$t('errors.invalidData')
      }
      // We have no idea what happened :(
      else {
        return this.$t('errors.unknownError') + e
      }
    },
    // updateLabel (label) {
    //   console.log(label)
    //   if (label) {
    //     // console.log(label)
    //     this.actionLabel = label // workaround for vue-i18n
    //   }
    //   else {
    //     return this.$t('eosAPI.actions.' + this.actionState + '.label')
    //   }
    // },
    detectLedger (count = 0) {
      this.signTX()
    },
    async initialize () {
      let account = this.$route.params.accountName
      this.getAccount(account)
      this.getHistory(account)
      // this.getTicker()
      this.getProducers(account)
      // this.getProposals()
      this.getPrice(account)
    }
  },
  computed: {
    totalBalance () {
      return (this.accountData.total_resources) ? this.resources.cpuTotal + this.resources.netTotal + this.resources.liquid : this.resources.liquid
    },
    responseEmpty () {
      return (Object.keys(this.responseData).length === 0 && this.responseData.constructor === Object)
    },
    inTheJungle () {
      return (this.$route.meta[this.$route.params.network].chain !== 'EOS')
      // console.log('jungle check', this.$eos.config.chainId)
      // let chainId = this.$eos.config.chainId
      // return (chainId === 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' || chainId === '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191' || chainId === '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f')
    },
    basicFunctions () {
      return [
        {
          value: 'transfer',
          icon: 'attach_money',
          label: this.$t('eosAPI.actions.transfer.label', [this.$route.meta[this.$route.params.network].symbol]),
          brief: this.$t('eosAPI.actions.transfer.brief', [this.$route.meta[this.$route.params.network].symbol])
        },
        {
          value: 'buyrambytes',
          label: this.$t('eosAPI.actions.buyrambytes.label'),
          brief: this.$t('eosAPI.actions.buyrambytes.brief')
        },
        {
          value: 'sellram',
          label: this.$t('eosAPI.actions.sellram.label'),
          brief: this.$t('eosAPI.actions.sellram.brief')
        },
        {
          value: 'delegatebw',
          label: this.$t('eosAPI.actions.delegatebw.label'),
          brief: this.$t('eosAPI.actions.delegatebw.brief')
        },
        {
          value: 'undelegatebw',
          label: this.$t('eosAPI.actions.undelegatebw.label'),
          brief: this.$t('eosAPI.actions.undelegatebw.brief')
        },
        {
          value: 'voteproducer',
          icon: 'how_to_vote',
          label: this.$t('eosAPI.actions.voteproducer.label'),
          brief: this.$t('eosAPI.actions.voteproducer.brief')
        }
      ]
    },
    advancedFunctions () {
      return [
        {
          value: 'newAccount',
          icon: 'person_add',
          label: this.$t('eosAPI.actions.newAccount.label'),
          brief: this.$t('eosAPI.actions.newAccount.brief')
        },
        {
          value: 'refund',
          icon: 'undo',
          label: this.$t('eosAPI.actions.refund.label'),
          brief: this.$t('eosAPI.actions.refund.brief')
        },
        // {
        //   value: 'updateauth',
        //   icon: 'settings',
        //   label: 'updateauth', // this.$t('eosAPI.actions.voteproducer.label'),
        //   brief: 'update account authentication' // this.$t('eosAPI.actions.voteproducer.brief')
        // },
        // {
        //   value: 'link',
        //   icon: 'settings',
        //   label: 'link', // this.$t('eosAPI.actions.voteproducer.label'),
        //   brief: 'link account authentication' // this.$t('eosAPI.actions.voteproducer.brief')
        // },
        // {
        //   value: 'unlink',
        //   icon: 'settings',
        //   label: 'unlink', // this.$t('eosAPI.actions.voteproducer.label'),
        //   brief: 'unlink account authentication' // this.$t('eosAPI.actions.voteproducer.brief')
        // },
        {
          value: 'pushtransaction',
          icon: 'signal_wifi_off',
          label: this.$t('eosAPI.actions.pushtransaction.label'),
          brief: this.$t('eosAPI.actions.pushtransaction.brief')
        }
        // {
        //   value: 'chintailease',
        //   icon: 'settings',
        //   label: 'chintai lease', // this.$t('eosAPI.actions.voteproducer.label'),
        //   brief: 'test for chintai lease' // this.$t('eosAPI.actions.voteproducer.brief')
        // }
      ]
    }
  },
  watch: {
    defaultAPI: function (newVal, oldVal) {
      this.initialize()
    },
    isProxy: function (newVal, oldVal) {
      this.$emit('isProxy', this.isProxy)
    },
    isProducer: function (newVal, oldVal) {
      this.$emit('isProducer', this.isProducer)
    },
    currentStep: function (newVal, oldVal) {
      if (newVal === 'second') {
        this.detectLedger()
        setTimeout(() => {
          if (this.responseEmpty) {
            this.updateAnimation() // the delay gives the svg time to load before I alter it
          }
        }, 2000)
      }
    }
  },
  beforeMount () {
    console.log('$eos', this.$eos)
    console.log('$route', this.$route)
    this.$emit('isProxy', false)
    this.$emit('isProducer', false)
    this.initialize()
    if (!this.$q.platform.is.chrome && !this.$q.platform.is.opera) {
      this.needsChrome()
    }
    if (this.$route.params.dPath) {
      dPath.urlProvided = this.$route.params.dPath.replace(/-/g, '/')
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.q-if-addon-right
  padding-left 4px

@media (max-width: 767px)
  .maximize-icon
    display none

</style>
