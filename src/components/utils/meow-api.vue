<template>
  <q-page class="flex row flex-center">
    <div id="api-container">
      <q-card id="meow-card" class="text-white shadow-6 animation-target">

        <q-ajax-bar id="meow-loader" ref="loading" :color="ledgerErr || noAccountsErr ? 'red-10' : 'secondary'" size="5px"/>

        <q-card-title class="relative-position fade-target">
          <img class="vertical-middle on-left" alt="altShiftDev Logo" style="height: 25px;" src="statics/altshiftdev_logo.svg">

          <div class="q-title vertical-middle inline-block">MEOW eContract: <span class="text-weight-bold">{{ title }}</span></div>

          <q-btn @click.native="abort()" id="close-login" icon="close" flat dense class="absolute-top-right" color="white" style="top: 0px; right: 5px"
          />

          <span slot="subtitle" class="text-grey">{{ subtitle }}</span>

        </q-card-title>
        <q-card-main class="row q-px-none fade-target">
          <template v-if="$route.params.contract">
            <eos-ram ref="buysellram" v-if="$route.params.contract === 'buyrambytes' || $route.params.contract === 'sellram'" :accountData="accountData" :eosPrice="eosPrice" :maxWidth="maxWidth" :byteConverter="byteConverter" :handleSuccess="handleSuccess" :handleFailure="handleFailure" :status="status" :ledger="ledger" v-on:updateEstimate="updateEstimate" v-on:updateSubtitle="updateSubtitle"/>
            <eos-transfer ref="transfer" v-if="$route.params.contract === 'transfer' && tokenData" :accountData="accountData" :resources="resources" :tokenData="tokenData" :eosPrice="eosPrice" :maxWidth="maxWidth" :handleSuccess="handleSuccess" :handleFailure="handleFailure" :status="status" :ledger="ledger" v-on:updateEstimate="updateEstimate" v-on:updateSubtitle="updateSubtitle"/>
            <eos-vote-proposal ref="voteproposal" v-if="$route.params.contract === 'voteproposal'" :accountData="accountData" :resources="resources" :maxWidth="maxWidth" :handleSuccess="handleSuccess" :handleFailure="handleFailure" :status="status" :ledger="ledger" v-on:updateEstimate="updateEstimate" v-on:updateSubtitle="updateSubtitle"/>
          </template>

          <!-- signature -->
          <contract-signature :signed="signed"/>
        </q-card-main>

        <q-card-actions class="justify-between relative-position items-center fade-target">
          <span class="q-caption col-8 text-grey-1">{{ estimate }}</span>
          <div class="col"></div>

          <q-btn-dropdown :disable="status.loading" color="secondary" icon-right="border_color" @click="sign(selectedWallet)" split class="col-auto" :label="`Sign with ${selectedWallet.name}`" no-caps>

            <q-list striped separator dark link class="bg-grey-9">
              <q-item @click.native="selectedWallet = wallet; sign(wallet)" :disabled="wallet.disabled" v-for="(wallet, index) in hardwareWallets" :key="index" v-close-overlay>
                <q-item-main :label="wallet.name" :sublabel="`${wallet.sublabel}`"/>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        </q-card-actions>

      </q-card>

      <!-- animations -->
      <div class="progress-bar"></div>
      <svg id="svg-check" x="0px" y="0px" viewBox="0 0 25 30">
        <path class="svg-check-path" d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"/>
      </svg>
    </div>
  </q-page>
</template>

<script>
import anime from 'animejs'
import eosRam from 'components/contracts/eos-ram.vue'
import eosTransfer from 'components/contracts/eos-transfer.vue'
import eosVoteProposal from 'components/contracts/eos-vote-proposal.vue'
import contractSignature from 'components/contracts/contract-signature.vue'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import LedgerEos from 'assets/EosLedger.js'
import Eos from 'eosjs'

// const DecimalPad = Eos.modules.format.DecimalPad
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

// async function ledgerAPI () {
//   const transport = await TransportU2F.create()
//   return new LedgerEos(transport)
// }

const meowVersion = '0.8.0'

export default {
  name: 'API',
  components: {
    eosRam,
    eosTransfer,
    eosVoteProposal,
    contractSignature
  },
  props: ['accountData', 'resources', 'tokenData', 'eosPrice'],
  data () {
    return {
      isProd: process.env.PROD,
      selectedWallet: {
        name: 'Ledger',
        value: 'ledger'
      },
      publicKeys: [],
      ledger: {
        appVersion: '',
        arbitraryEnabled: undefined
      },
      accounts: [],
      hardwareWallets: [
        {
          name: 'Ledger',
          value: 'ledger',
          sublabel: 'Ledger Nano S',
          disabled: false
        },
        {
          name: 'Trezor',
          value: 'trezor',
          sublabel: 'Trezor Support Coming Soon',
          disabled: true
        }
      ],
      subtitle: '',
      estimate: '',
      status: {
        loading: false,
        signRequested: false,
        ledgerRequiresArbitrary: undefined,
        validated: undefined,
        walletFound: undefined,
        arbitraryEnabled: undefined,
        userAccepted: undefined,
        txSigned: undefined,
        txSent: undefined,
        message: undefined
      },
      // useCustomPath: false,
      // customPath: path,
      // loading: false,
      ledgerErr: false,
      noAccountsErr: false,
      signed: false
    }
  },
  watch: {
  },
  computed: {
    title () {
      console.log('route info', this.$route)
      if (this.$route.params.contract === 'buyrambytes') {
        return 'Buy RAM'
      }
      else if (this.$route.params.contract === 'sellram') {
        return 'Sell Ram'
      }
      else if (this.$route.params.contract === 'transfer') {
        return 'Transfer'
      }
      else if (this.$route.params.contract === 'voteproposal') {
        return 'Proposal Voting'
      }
    }
  },
  beforeMount () {
    dPath.urlProvided = this.$route.params.dPath.replace(/-/g, '/')
  },
  mounted () {
    console.log('mounted meowapi', this.tokenData)
  },
  methods: {
    loginAnimation () {
      let basicTimeline = anime.timeline()
      let pathEls = document.getElementsByClassName('svg-check-path')
      let pathEl
      let offset
      for (let i = 0; i < pathEls.length; i++) {
        pathEl = pathEls[i]
        offset = anime.setDashoffset(pathEl)
        pathEl.style['stroke-dashoffset'] = 'offset'
      }
      basicTimeline
        .add({
          targets: ['#close-login', '#meow-loader', '.fade-target'],
          duration: 50,
          opacity: 0,
          easing: 'linear'
        })
        .add({
          targets: '.animation-target',
          duration: 500,
          scaleY: 0.04,
          width: 600,
          backgroundColor: '#2B2D2F',
          easing: 'easeInOutSine'
        })
        .add({
          targets: '.progress-bar',
          delay: 200,
          duration: 900,
          width: 600,
          easing: 'easeInOutSine'
        })
        .add({
          targets: '.animation-target',
          width: 0,
          height: 0,
          duration: 1
        })
        .add({
          targets: '.progress-bar',
          width: 80,
          height: 80,
          delay: 150,
          duration: 500,
          borderRadius: 80
        })
        .add({
          targets: '#svg-check',
          opacity: 1,
          duration: 1
        })
        .add({
          targets: pathEl,
          strokeDashoffset: [offset, 0],
          duration: 200,
          easing: 'easeInOutSine'
        })
      basicTimeline.play()
    },
    maxWidth (val = '', error, suffix = '', placeholder = '') {
      // console.log('val', val, error, suffix)
      val = (val !== null) ? val.toString() : ''
      let len = (val.length + suffix.length + 1)
      if (val.length === 0) {
        len = (placeholder.length + suffix.length + 1)
      }
      return error ? (len * 12) : (len * 5.75) + 35
    },
    byteConverter (val) {
      // console.log('val')
      let prefix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let index = 0
      let byteUpgrader = function (val) {
        return (val / 1024)
      }
      while (val > 500 && index < 5) {
        val = byteUpgrader(val)
        index++
      }
      return val.toFixed(2) + ' ' + prefix[index]
    },
    updateSubtitle (subtitle) {
      this.subtitle = subtitle
    },
    sign (wallet) {
      this.resetStatus()
      this.txId = ''
      console.log(`${this.$route.params.contract} ref`, this.$refs[this.$route.params.contract])
      this.status.loading = true
      this.status.signRequested = true
      this.$route.params.contract === 'buyrambytes' || this.$route.params.contract === 'sellram' ? this.$refs.buysellram.generatePayload() : this.$refs[this.$route.params.contract].generatePayload()
      // this.animate()
      // this.signed = !this.signed
    },
    updateEstimate (estimate) {
      this.estimate = estimate
    },
    handleSuccess (r) {
      // this.$refs.stepper.next()
      this.status.validated = true // transaction is valid
      console.log('Unsigned TX Received:', r.transaction)
      this.pendingTransaction = r.transaction
      this.responseData = {}
      this.findLedger()
    },
    async findLedger () {
      try {
        const ledger = await ledgerAPI()
        let r = await ledger.getAppConfiguration()
        console.log(`Version: ${r.version}, arbitraryTxEnabled: ${r.arbitraryEnabled}`)
        this.ledger.appVersion = r.version
        this.ledger.arbitraryEnabled = r.arbitraryEnabled
        this.status.walletFound = true // Ledger must have been found
        this.signTX()
      }
      catch (e) {
        console.log('failed to find ledger', e)
        this.status.walletFound = false // Ledger wasn't found
        this.status.loading = false // Ledger wasn't found
        this.$q.notify(this.$t('notifications.noLedger'))
        // this.loading = false
      }
    },
    async signTX (useHash = false) {
      let tx = this.pendingTransaction
      this.pendingTransaction = tx

      const ledger = await ledgerAPI()
      const buffer = await ledger.serialize(tx, this.$eos.config.chainId, this.$eos.fc.types)
      const response = await signTransaction(dPath.urlProvided || 0, buffer.toString('hex'))

      if (typeof response === 'string') {
        // handle errors from the device
        // this.status.txSigned = false // tx must have failed
        this.status.loading = false
        this.handleFailure(response, true)
        this.responseData = { 'error': response }
        // this.$refs.stepper.next()
        return
      }
      this.status.userAccepted = true // user must have accepted
      this.status.txSigned = true // tx was signed

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
        // this.$refs.stepper.goToStep('third')
        this.responseData = r // Response data is shown in the UI's json viewer
        this.txId = r.transaction_id
        this.status.message = `txid: ${this.txId}`
        this.status.txSent = true // tx was pushed successfully
        this.signed = true
        this.status.loading = false // tx was pushed successfully
        this.$q.notify({
          type: 'info',
          message: 'Returning to App in 5 seconds...'
        })
        setTimeout(() => {
          // parent.postMessage(payload, '*')
          // if (!this.isProd) { console.log('Submitting', payload) }
          this.submit()
        }, 5000)
        // this.initialize() // Since a tx has been made, get new account balance, history, etc...
      }
      catch (e) {
        console.log(e)
        // Handle failures from the network
        this.status.txSent = false // tx was not pushed successfully
        this.status.loading = false
        this.handleFailure(e)
        // console.log(e.response, e.response.status)
        // if (e.response && e.response.status) {
        //   this.handleFailure(e)
        // }
        // else {
        //   this.handleFailure('Couldn\'t push to EOS network', true)
        // }
        this.responseData = e
        this.txId = ''
        // this.$refs.stepper.goToStep('third')
      }
    },
    handleFailure (e, alreadyProcessed = false, userError = []) {
      this.status.loading = false
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
        this.status.message = err
        this.$q.notify(err) // Notify user of error a long with custom, user-friendly error messages
      }
      catch (ee) {
        console.error(ee)
        if (userError.length === 0) {
          userError.push('Unknown Error')
        }
        this.txFailed = 'Unknown Error'
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
        this.status.userAccepted = false // user did not accept tx on device
        return this.$t('errors.txRejected')
      }
      if (e.toLowerCase().includes('detected a non-hardened path element')) {
        return this.$t('errors.nonHardened')
      }
      if (e.toLowerCase().includes('u2f timeout')) {
        this.status.userAccepted = false // user did not accept tx on device
        return this.$t('errors.timeout')
      }
      if (e.toLowerCase().includes('invalid data received')) {
        console.log('status', this.status)
        if (this.status.ledgerRequiresArbitrary && !this.ledger.arbitraryEnabled) {
          return this.$t('errors.needArbitraryMode')
        }
        else {
          return this.$t('errors.invalidData')
        }
      }
      // We have no idea what happened :(
      else {
        return typeof e === 'string' ? `${this.$t('errors.unknownError')}: ${e}` : this.$t('errors.unknownError')
      }
    },
    resetStatus () {
      this.status = {
        loading: false,
        signRequested: false,
        ledgerRequiresArbitrary: undefined,
        validated: undefined,
        walletFound: undefined,
        userAccepted: undefined,
        txSigned: undefined,
        txSent: undefined,
        message: undefined
      }
      this.ledger = {
        appVersion: '',
        arbitraryEnabled: undefined
      }
    },
    submit () {
      // let ver = this.ledger.appVersion.replace(/\./g, '')
      const payload = {
        success: (this.txId !== ''),
        txId: this.txId,
        // ledgerAppVersion: this.ledger.appVersion,
        // multiActionSupport: (Number(ver) >= 120),
        // dAppSupport: (Number(ver) >= 110),
        meowVersion: meowVersion
      }
      // this.$q.localStorage.set('accountInfo', payload)
      this.loginAnimation()
      setTimeout(() => {
        parent.postMessage(payload, '*')
        if (!this.isProd) { console.log('Submitting', payload) }
      }, 2800)
    },
    abort () {
      this.resetStatus()
      const payload = {
        success: false,
        details: 'User closed window',
        meowVersion: meowVersion
      }
      parent.postMessage(payload, '*')
      if (!this.isProd) { console.log('Submitting', payload) }
    }
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  .q-card-actions-horiz .q-btn + .q-btn {
    margin-left: unset
  }
  .animation-target {
    background: #2B2D2F;
  }

  .progress-bar {
    position: absolute;
    height: 10px;
    width: 0;
    right: 0;
    top: 50%;
    left: 50%;
    border-radius: 200px;
    transform: translateY(-50%) translateX(-50%);
    background: #26A69A;
  }

  #svg-check {
    opacity: 0;
    width: 30px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
    right: 0;
  }

  .svg-check-path {
    fill: none;
    stroke: #FFFFFF;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

</style>
