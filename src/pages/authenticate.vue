<template>
  <q-page class="flex row flex-center">
    <div id="login-container">
      <q-card id="meow-card" class="text-white shadow-6 animation-target">
        <q-ajax-bar id="meow-loader" ref="loading" :color="ledgerErr || noAccountsErr ? 'red-10' : 'secondary'" size="5px"/>

        <q-card-title class="text-center relative-position fade-target">
          <img class="vertical-middle on-left" alt="altShiftDev Logo" style="height: 25px;" src="statics/altshiftdev_logo.svg">
          <div class="q-title vertical-middle inline-block">MEOW Login</div>
          <q-btn @click.native="abort()" id="close-login" icon="close" flat dense class="absolute-top-right" color="white"
            style="top: 0px; right: 5px"
          />
          <span slot="subtitle" class="text-white">Access EOS dApps with your Ledger</span>
        </q-card-title>

        <q-card-main class="fade-target">
          <div class="q-mb-xs col-12 row relative-position">

            <div class="col-6 q-my-xs">
              <q-input ref="inputPath" :disable="!useCustomPath" hide-underline dark v-model="customPath" float-label="Derivation Path" color="secondary" @keyup.enter="validateFields()" />
            </div>

            <q-checkbox class="col-6 q-py-md" v-model="useCustomPath" label="Custom Path" @input="$nextTick(function () {$refs.inputPath.focus(); customPath = `44'/194'/0'/0/`})"/>

            <q-btn outline :loading="loading" color="white" class="col-12 q-mt-sm q-mb-md" no-caps @click="login()">
              <!-- Dynamic labels -->
              <q-spinner-oval slot="loading"/>
              <span slot="loading" class="on-right">{{ status }}</span>
              <!-- Static Labels -->
              <span v-if="accounts.length > 0">Log In Below or Search Again</span>
              <span v-else-if="ledgerErr" class="text-red-13">Ledger Not Found - Search Again?</span>
              <span v-else-if="noAccountsErr" class="text-red-13">No Accounts Found - Search Again?</span>
              <span v-else>Get Accounts</span>
            </q-btn>

            <span class="q-caption text-grey absolute-bottom text-center" v-if="ledger.appVersion && ledger.appVersion !== ''">
              <q-icon v-if="latestVersion" name="check_circle" color="positive"/>
              <q-icon v-else name="error" color="negative"/>
              {{ `Ledger EOS v${ledger.appVersion}` }}
              <span v-if="latestVersion">(you have the latest version)</span>
              <span v-else>(your version is out of date)</span>
            </span>

          </div>

        </q-card-main>

        <q-card-actions class="justify-between relative-position items-center fade-target">
          <div class="col"></div>

          <q-btn-dropdown color="secondary" :disable="accounts.length === 0" @click="submit(selectedAccount)" split class="col-auto" :label="accounts.length === 0 || !selectedAccount.name ? `Waiting for Accounts` : `Log In as ${selectedAccount.name}@${selectedAccount.authority}`" no-caps>
            <q-list striped separator dark link class="bg-grey-9">
              <q-item @click.native="selectedAccount = account; submit(account)" v-for="(account, index) in accounts" :key="index" v-close-overlay>
                <q-item-main :label="account.name" :sublabel="`@${account.authority}`"/>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        </q-card-actions>

      </q-card>
      <div class="progress-bar"></div>
      <svg id="svg-check" x="0px" y="0px" viewBox="0 0 25 30">
        <path class="svg-check-path" d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"/>
      </svg>
      <!--<div class="row justify-between q-pt-sm" :class="[ $route.path === '/sessionExpired' ? 'text-grey-9' : 'text-grey']">-->
        <!--<q-btn-dropdown :label="defaultLanguage.label" flat no-caps dense size="sm" class="col-auto">-->
          <!--<q-list link>-->
            <!--<q-item v-for="(lang, index) in languages" :key="index" v-close-overlay @click.native="defaultLanguage = lang">-->
              <!--<q-item-main :label="lang.label" class="q-caption"/>-->
            <!--</q-item>-->
          <!--</q-list>-->
        <!--</q-btn-dropdown>-->
        <!--<div class="col"></div>-->
        <!--<q-btn label="Help" flat no-caps dense size="sm" class="col-auto"/>-->
        <!--<q-btn label="Privacy" flat no-caps dense size="sm" class="col-auto"/>-->
        <!--<q-btn label="Terms" flat no-caps dense size="sm" class="col-auto" @click="animate()"/>-->
      <!--</div>-->
    </div>
  </q-page>
</template>

<script>
import anime from 'animejs'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import LedgerEos from 'assets/EosLedger.js'

const path = "44'/194'/0'/0/"

async function ledgerAPI () {
  const transport = await TransportU2F.create()
  return new LedgerEos(transport)
}

const meowVersion = '0.8.0'

export default {
  name: 'Login',
  components: {
  },
  props: [],
  data () {
    return {
      isProd: process.env.PROD,
      selectedAccount: {},
      publicKeys: [],
      ledger: {
        appVersion: '',
        arbitraryEnabled: undefined
      },
      accounts: [],
      status: '',
      useCustomPath: false,
      customPath: path,
      loading: false,
      ledgerErr: false,
      noAccountsErr: false,
      defaultLanguage: {
        label: 'English (United States)',
        value: 'en-us'
      },
      languages: [
        {
          label: 'English (United Kingdom)',
          value: 'en-uk'
        },
        {
          label: 'English (United States)',
          value: 'en-us'
        },
        {
          label: 'Français (Canada)',
          value: 'fr-ca'
        },
        {
          label: 'Français (France)',
          value: 'fr-fr'
        }
      ]
    }
  },
  watch: {
  },
  computed: {
    latestVersion () {
      let ver = this.ledger.appVersion.replace(/\./g, '')
      let latest = this.$route.meta.ledgerAppVersion.replace(/\./g, '')
      return (Number(ver) >= Number(latest))
    }
  },
  methods: {
    animate () {
      anime({
        targets: '#login-container',
        translateX: [
          { value: 10, duration: 50 },
          { value: 0, duration: 50 },
          { value: -10, duration: 50 },
          { value: 0, duration: 50 },
          { value: 10, duration: 50 },
          { value: 0, duration: 50 }
        ],
        duration: 300,
        loop: false
      })
    },
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
          width: 320,
          backgroundColor: '#2B2D2F',
          easing: 'easeInOutSine'
        })
        .add({
          targets: '.progress-bar',
          delay: 200,
          duration: 900,
          width: 320,
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
    async login (count = 5) {
      this.$refs.loading.start()
      this.status = 'Searching for Ledger'
      this.ledgerErr = false
      this.ledger.appVersion = ''
      this.ledger.arbitraryEnabled = undefined
      this.noAccountsErr = false
      this.loading = true
      this.publicKeys = []
      this.selectedAccount = {}
      this.accounts = []
      try {
        const ledger = await ledgerAPI()
        let r = await ledger.getAppConfiguration()
        this.ledger.appVersion = r.version
        this.ledger.arbitraryEnabled = r.arbitraryEnabled

        if (!this.isProd) { console.log(`Version: ${r.version}, arbitraryTxEnabled: ${r.arbitraryEnabled}`) }
        if (this.useCustomPath) {
          let dPath = this.customPath
          let key = await ledger.getPublicKey(dPath, false, false)
          this.ledgerErr = false
          this.status = 'Searching for Accounts...'
          this.getAccounts(key.address, dPath.replace(/\//g, '-'), true)
        }
        else {
          for (var i = 0; i < count; i++) {
            let dPath = path + i
            let key = await ledger.getPublicKey(dPath, false, false)
            this.ledgerErr = false
            this.status = 'Searching for Accounts...'
            this.getAccounts(key.address, dPath.replace(/\//g, '-'), (i + 1 === count))
          }
        }
      }
      catch (e) {
        console.log('Failed to find Ledger', e)
        this.ledgerErr = true
        this.animate()
        this.loading = false
        this.$refs.loading.stop()
      }
    },
    async getAccounts (key, dPath, lastOne) {
      if (!this.isProd) { console.log('key', key, dPath, lastOne) }
      let payload = { public_key: key }

      try {
        let r = await this.$eos.getKeyAccounts(payload)
        let accounts = r.account_names
        this.publicKeys.push({ key: key, accounts: accounts, dPath: dPath })
        for (var x of accounts) {
          let rr = await this.$eos.getAccount(x)
          let arr = rr.permissions
          arr = arr.map(v => ({
            authority: v.perm_name,
            keys: v.required_auth.keys
          }))
          for (var z of arr) {
            if (z.keys.length > 0 && z.keys[0].key === key) {
              if (!this.isProd) { console.log(`successful match for ${x} with ${z.authority}`) }
              this.accounts.push({ name: x, authority: z.authority, dPath: dPath })
            }
          }
        }
        this.selectedAccount = this.accounts[0]
        if (lastOne && this.accounts.length > 0) {
          this.noAccountsErr = false
          let arr = this.publicKeys.filter(x => x.accounts.length !== 0)
          for (var y of arr) {
            if (!this.isProd) { console.log(y) }
            this.$refs.loading.stop()
            this.loading = false
          }
        }
        if (lastOne && this.accounts.length === 0) {
          this.noAccountsErr = true
          this.animate()
          this.$refs.loading.stop()
          this.loading = false
        }
      }
      catch (e) {
        console.log(e)
        this.loading = false
        this.animate()
        this.noAccountsErr = true
        this.$refs.loading.stop()
      }
    },
    submit (account) {
      let ver = this.ledger.appVersion.replace(/\./g, '')
      const payload = {
        success: account.name !== '' && account.authority !== '',
        account: account, // { name: account.name, authority: account.authority },
        ledgerAppVersion: this.ledger.appVersion,
        multiActionSupport: (Number(ver) >= 120),
        dAppSupport: (Number(ver) >= 110),
        meowVersion: meowVersion
      }
      this.$q.localStorage.set('accountInfo', payload)
      this.loginAnimation()
      setTimeout(() => {
        parent.postMessage(payload, '*')
        if (!this.isProd) { console.log('Submitting', payload) }
      }, 2800)
    },
    abort () {
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
