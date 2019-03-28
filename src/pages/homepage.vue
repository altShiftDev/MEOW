<template>
  <q-page style="overflow: hidden" class="bg-grey-3">
    <q-alert icon="new_releases" class="col-12 q-pb-md full-width" color="secondary"
             detail="Go to EOS Authority' Polls page to Vote with MEOW! https://eosauthority.com/polls?lnc=en - Want more dApps to support the MEOWnet? Reach out to them on telegram and ask for MEOWnet support!">
      Update: <a href="https://medium.com/@altShiftDev/altshiftdev-presents-meownet-e62cbc9a6061" target="_blank">The MEOWnet has launched</a> - You can now vote on Referendums & Polls with your Hardware Wallet!
    </q-alert>

    <div class="flex row col-12 justify-center items-center text-center flex-center q-pt-md">
      <template v-if="publicKeys.length === 0">
        <!--<div class="gt-sm q-display-1 col-auto text-weight-thin">{{ $t('homepage.connect') }} </div>-->
        <!--<div class="lt-md q-headline col-auto text-weight-thin">{{ $t('homepage.connect') }} </div>-->
        <div class="gt-sm q-display-1 col-auto text-weight-thin">Connect to</div>
        <div class="lt-md q-headline col-auto text-weight-thin">Connect to</div>

        <q-btn-dropdown class="col-auto on-right on-left" color="deep-purple" outline split :label="networkLabel(selectedChain)" no-caps>
          <q-list link>
            <q-item v-for="chain in chains" :key="chain.value" v-close-overlay @click.native="selectedChain = chain.value; changeChain(chain.value)">
              <q-item-side :avatar="chain.avatar" inverted color="primary" />
              <q-item-main :label="chain.label"/>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <div class="gt-sm q-display-1 col-auto text-weight-thin"> using your </div>
        <div class="lt-md q-headline col-auto text-weight-thin"> using your </div>

        <q-btn-dropdown class="col-auto on-right" color="primary" outline split label="Ledger Nano S" @click="loading = true; getPublic()" no-caps>
          <!-- dropdown content -->
          <q-list link>
            <q-item v-close-overlay @click.native="loading = true; getPublic()">
              <q-item-main label="Ledger Nano S" :sublabel="$t('buttons.needChrome')"/>
            </q-item>
            <q-item disabled>
              <q-item-main label="Trezor" sublabel="Coming Soon"/>
            </q-item>
            <q-item disabled>
              <q-item-main label="Scatter" sublabel="Coming Soon"/>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div class="col-12 row q-mt-lg pad-on-desk q-mb-xl justify-around">

          <object v-if="loading" alt="Connect your Ledger" height="300px" type="image/svg+xml" data="statics/connectLedger.svg" style="margin-left: auto; margin-right: auto; display: block; margin-top: -22px"/>

          <div class="col-12 row q-mt-lg justify-center">
            <span class="gt-sm q-display-1 col-12 text-weight-thin q-mb-md">{{ $t('homepage.accountViewer') }}</span>
            <span class="lt-md q-headline col-12 text-weight-thin q-mb-md">{{ $t('homepage.accountViewer') }}</span>

            <q-search inverted color="white" v-model="searchInput" placeholder="Search by account name or public key" class="col-md-8 col-xs-11 text-black" @keyup.enter="search(searchInput)" />
          </div>
        </div>
      </template>

      <template v-if="publicKeys.length > 0">
        <div class="q-mb-md col-12 row justify-center">

          <span class="col-12 q-display-1 text-weight-thin q-mb-lg">
            <q-btn icon="arrow_back" flat @click="publicKeys = []"/>
            <span class="lt-sm block">{{ $t('homepage.publicKeys') }}</span>
            <span class="gt-xs">{{ $t('homepage.publicKeys') }}</span>
          </span>

          <q-btn @click="keyIndex = index" :color="x.accounts.length > 0 ? 'deep-purple' : 'light'" v-for="(x, index) in publicKeys" :label="windowWidth > 500 ? x.key : x.key.slice(0, 8) + '...' + x.key.slice(-5)" :key="index" no-caps
          class="q-ma-md" :class="x.accounts.length > 0 ? 'col-auto' : 'col-auto'">

            <q-chip v-if="x.accounts.length > 0" floating color="primary">{{ x.accounts.length }}</q-chip>
            <q-chip v-else floating color="grey">{{ x.accounts.length }}</q-chip>

          </q-btn>

        </div>

        <template v-if="keyIndex !== false">
          <div class="q-my-sm q-mb-xl col-12 row justify-center items-center">
            <hr class="q-hr col-6 q-mb-xl">

            <span class="gt-sm break-n-wrap col-12 q-title text-grey-9 q-mb-md">
              {{ publicKeys[keyIndex].key }}
            </span>

            <span class="lt-md break-n-wrap col-12 q-subheading text-grey-9 q-px-sm q-mb-md">
              {{ publicKeys[keyIndex].key }}
            </span>

            <template v-if="publicKeys[keyIndex].dPath">
              <span class="col-auto q-title text-weight-thin on-left">@</span>
              <q-chip class="col-auto" color="amber">{{ publicKeys[keyIndex].dPath }}</q-chip>
              <q-btn @click="confirmPublicKey(publicKeys[keyIndex].dPath)" dense outline class="block col-auto" color="deep-purple">Confirm on Ledger Device</q-btn>
            </template>

            <template v-if="publicKeys[keyIndex].accounts.length > 0">
              <div class="gt-sm q-display-1 col-12 q-my-md text-weight-thin">{{ $t('homepage.link') }}</div>
              <div class="lt-md q-headline col-12 q-my-md text-weight-thin">{{ $t('homepage.link') }}</div>
            </template>

            <span v-else class="q-subheading q-my-md col-12">
              <q-icon class="on-left" color="amber" name="info"/>
              {{ $t('homepage.notFound') }}
            </span>

            <q-btn :to="`/${$route.params.network ? $route.params.network : 'eos'}/account/${x}/${cleanPath()}${$route.query.api ? `?api=${$route.query.api}` : ''}`" icon-right="open_in_new" color="primary" v-for="(x, index) in publicKeys[keyIndex].accounts" :label="x" :key="index" no-caps class="col-auto q-ma-sm q-py-md"/>

          </div>
        </template>

        <div v-if="ledger.appVersion && ledger.appVersion !== ''" id="appVersion" class="q-pb-xs">
          <div class="self-center text-grey q-py-sm">
            <q-icon v-if="latestVersion" name="check_circle" color="positive"/>
            <q-icon v-else name="error" color="negative"/>
          <!--<q-icon name="done" color="secondary"/>-->
            {{ `Ledger EOS v${ledger.appVersion}` }}
            <span v-if="latestVersion">(you have the latest version)</span>
            <span v-else>(your version is out of date)</span>
          </div>

          <template v-if="!latestVersion">
            <span class="q-caption block">(You may have to uninstall the old version before it will allow you to update, you will not lose any data by uninstalling the app.)</span>

            <div class="q-pt-md text-left">
              <span class="q-title">What's New in version {{ $route.meta.ledgerAppVersion }}?</span>
              <ul>
                <li>Multi-Action Transactions (Create Account, Chintai)</li>
                <li>Better Support for Arbitrary Transactions</li>
              </ul>
            </div>
          </template>
        </div>

      </template>
    </div>

    <!-- sponsors -->
    <div class="row col-12 q-pa-lg bg-grey-9 justify-around text-white">
      <div class="row col-12 justify-center">
        <q-btn v-for="(x, index) in sponsors" :key="index" flat outline class="text-center col-auto" link type="a" target="_blank" :href="x.url" no-caps>

          <template v-if="x.logo === 'blockmatrix'">
            <img class="patron-logo q-pb-xs" src="statics/sponsors/blockmatrix.png?v=1">
          </template>

          <template v-if="x.logo === 'eos42'">
            <img class="patron-logo q-pb-xs" src="statics/sponsors/eos42.png?v=1">
          </template>

          <template v-if="x.logo === 'eosphere'">
            <img class="patron-logo q-pb-xs" src="statics/sponsors/eosphere.png?v=1">
          </template>

          <span class="q-subtitle col-12">{{ x.name }}</span>
        </q-btn>
      </div>

      <!-- <div class="col-xs-12 row justify-around text-center q-pt-sm"> -->
        <!--<q-btn color="deep-purple" dense class="col-auto q-my-xs q-py-xs q-px-xl text-center" link type="a" target="_blank" href="https://www.patreon.com/altshiftdev" no-caps>-->
          <!--<img alt="patreon logo" style="height: 20px; width: 20px;" src="statics/patreon.svg" class="on-left"/>{{ $t('buttons.patreon') }}-->
        <!--</q-btn>-->
      <span class="q-subtitle col-12 q-pt-md text-center q-pb-xs">This site is made possible by sponsors and user donations to EOS account <q-btn color="grey" dense link to="/eos/account/meow.x/" no-caps>meow.x</q-btn></span>
    </div>

    <q-jumbotron class="fit row">
      <div v-html="$t('welcome.first')" class="q-subtitle text-weight-light">
        <!-- {{ $t('welcome') }} -->
        <!-- Welcome to <strong>My EOS Wallet</strong> (MEOW), a simple and secure web app to access and manage your EOS holdings using secure hardware wallets such as the Ledger Nano S and the Trezor (coming soon) hardware wallet! -->
      </div>
      <div class="q-subtitle text-weight-light q-py-md">
        {{ $t('welcome.second') }}
        <span class="block q-pt-md">Thanks, <br> altShiftDev</span>
      </div>
    </q-jumbotron>

  <!--   <q-btn label="measureLatency" @click="measureLatency()" />
    <p v-if="endpoints.length > 0" v-for="(x, index) in endpoints" :key="index">
      Rank #{{index + 1}}: {{ x.name }} clocked in at {{ x.duration }}ms
    </p> -->
  </q-page>
</template>

<script>
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import LedgerEos from 'assets/EosLedger.js'
import { openURL } from 'quasar'

const path = "44'/194'/0'/0/"
// dev + make last path digit hardened
// const path = "44'/194'/0'/0'/"

async function ledgerAPI () {
  const transport = await TransportU2F.create()
  return new LedgerEos(transport)
}

export default {
  name: 'home',
  props: ['defaultAPI', 'allEndpoints'],
  data () {
    return {
      selectedChain: this.$route.params.network ? this.$route.params.network : 'eos',
      chains: [
        {
          label: 'EOS',
          value: 'eos',
          avatar: `statics/icons/eos.svg?v=1`,
          inset: true
        },
        {
          label: 'Telos',
          value: 'telos',
          avatar: `statics/icons/telos.png?v=1`,
          inset: true
        },
        {
          label: 'Worbli',
          value: 'worbli',
          avatar: `statics/icons/worbli.png?v=1`,
          inset: true
        },
        {
          label: 'BOS',
          value: 'bos',
          avatar: `statics/icons/bos.png?v=1`,
          inset: true
        },
        {
          label: 'Jungle V2 Testnet',
          value: 'jungle',
          avatar: `statics/icons/jungle.png?v=1`,
          inset: true
        },
        {
          label: 'CryptoKylin Testnet',
          value: 'cryptokylin',
          avatar: `statics/icons/cryptokylin.png?v=1`,
          inset: true
        }
      ],
      sponsors: [
        {
          'name': 'Block Matrix',
          'url': 'https://blockmatrix.network/',
          'logo': 'blockmatrix'
        },
        {
          'name': 'EOS 42',
          'url': 'https://eos42.io/',
          'logo': 'eos42'
        },
        {
          'name': 'EOSphere',
          'url': 'https://www.eosphere.io/',
          'logo': 'eosphere'
        }
      ],
      loading: false,
      keyIndex: false,
      searchInput: '',
      publicKeys: [
        // {
        //   key: 'eos123'
        //   accounts: ['abc', 'def', 'hij']
        // }
      ],
      ledger: {
        appVersion: '',
        arbitraryEnabled: undefined
      },
      accountNames: [],
      signalIcons: ['signal_wifi_off', 'signal_wifi_0_bar', 'signal_wifi_1_bar_lock', 'signal_wifi_2_bar_lock', 'signal_wifi_3_bar_lock', 'signal_wifi_4_bar_lock'],
      // pendingTransaction: {},
      // responseData: {},
      // titleOne: 'Unsigned Transaction',
      windowWidth: window.innerWidth,
      endpoints: [],
      secureEndpoints: ['https://eos.greymass.com:443', 'https://eosapi.blockmatrix.network:443', 'https://node1.eosphere.io', 'https://user-api.eoseoul.io:443', 'https://api.eosn.io', 'https://api.main.alohaeos.com:443'
      ]
    }
  },
  mounted () {
    if (!this.$q.platform.is.chrome && !this.$q.platform.is.opera) {
      this.$q.notify({
        type: 'info',
        message: this.$t('notifications.needChrome')
      })
    }
  },
  watch: {
    defaultAPI: function (newVal, oldVal) {
      if (this.publicKeys.length > 0) {
        // user is changing APIs during public key search, so refresh search
        this.getPublic()
      }
    }
  },
  methods: {
    openURL,
    changeChain (val) {
      console.log('changing to', val)
      this.$router.push(`/${val}/`)
    },
    networkLabel (chain) {
      console.log(chain)
      let arr = this.chains.filter(x => x.value === chain)
      let network = arr[0]
      console.log('network name', network)
      return network.label
    },
    measureLatency () {
      // this.endpoints = []
      let arr = []
      for (var x of this.secureEndpoints) {
        // eosConfig.httpEndpoint = x
        // while ()
        // this.$nextTick(function () {
        let start
        let finish
        // let endpoint
        let success
        let duration
        let name = x
        let icon

        // console.log(name)
        start = window.performance.now()
        // endpoint = x
        // await this.$eos.getInfo({})
        this.$axios.post(name + '/v1/chain/get_info', {}, {
          headers: {
            'Content-Type': 'text/plain' }})
          .then(r => {
            finish = window.performance.now()
            success = true
            duration = finish - start
            icon = this.signalIcons[this.iconRank(duration, success)]
            arr.push({ 'name': name, 'duration': duration, 'start': start, 'finish': finish, 'success': success, 'icon': icon })
            if (name === 'https://proxy.eosnode.tools') {
              console.log('r', r.headers['x-selected-node'])
            }
          })
          .catch(e => {
            finish = window.performance.now()
            success = false
            duration = finish - start
            arr.push({ 'name': name, 'duration': duration, 'start': start, 'finish': finish, 'success': success })
            // console.log('Failed:', x, e)
          })
        // })
      }
      // let arr = []

      this.endpoints = arr.sort(this.alphaSort)
      // console.log(this.endpoints[0])
      // console.log(`Rank 1: ${arr[0].name} clocked at ${arr[0].duration}ms`)
    },
    iconRank (duration, success) {
      if (!success) {
        return 0
      }
      if (duration >= 400) {
        return 1
      }
      if (duration >= 300 && duration < 400) {
        return 2
      }
      if (duration >= 200 && duration < 300) {
        return 3
      }
      if (duration >= 100 && duration < 200) {
        return 4
      }
      if (duration < 100) {
        return 5
      }
    },
    alphaSort (a, b, comp = 0) {
      if (a.duration < b.duration) {
        comp = -1
      }
      else if (b.duration < a.duration) {
        comp = +1
      }
      return comp
    },
    cleanPath () {
      let clean = (this.publicKeys[this.keyIndex].dPath) ? this.publicKeys[this.keyIndex].dPath.replace(/\//g, '-') : ''
      return `${clean}`
    },
    async search (searchInput) {
      console.log('searching for:', searchInput, this.searchInput)
      if (!searchInput || searchInput === '') {
        setTimeout(() => {
          console.log('delay', this.searchInput)
          if (this.searchInput !== '') {
            return this.search(this.searchInput)
          }
        }, 1000)
        return
      }
      searchInput = searchInput.trim()
      let isKey = (searchInput.length === 53)
      try {
        let payload = isKey ? { public_key: searchInput } : { account_name: searchInput.toLowerCase() }
        const data = isKey ? await this.$eos.getKeyAccounts(payload) : await this.$eos.getAccount(payload)
        if (data.account_name) {
          let network = `${this.$route.params.network ? this.$route.params.network : 'eos'}`
          let accountName = `${searchInput.toLowerCase()}`
          let api = `${this.$route.query.api ? `?api=${this.$route.query.api}` : ''}`
          let path = `/${network}/account/${accountName}/${api}`
          console.log('sending to', path, this.$route)
          this.$router.push(path)
        }
        else if (data.account_names) {
          this.publicKeys.push({ key: searchInput, accounts: data.account_names, dPath: undefined })
          this.keyIndex = 0
          for (var x of data.account_names) {
            this.accountNames.push(x)
          }
        }
      }
      catch (e) {
        console.log('e', e)
        this.$q.notify(this.$t('notifications.searchFailed'))
      }
    },
    async getPublic (count = 5) {
      this.publicKeys = []
      try {
        const ledger = await ledgerAPI()
        let r = await ledger.getAppConfiguration()
        this.ledger.appVersion = r.version
        this.ledger.arbitraryEnabled = r.arbitraryEnabled
        // let key
        for (var i = 0; i < count; i++) {
          let dPath = path + i // + '\''
          let key = await ledger.getPublicKey(dPath, false, false)
          this.getAccounts(key.address, dPath, (i + 1 === count))
        }
      }
      catch (e) {
        console.log('failed to find ledger', e)
        this.$q.notify(this.$t('notifications.noLedger'))
        this.loading = false
      }
    },
    async confirmPublicKey (dPath) {
      try {
        const ledger = await ledgerAPI()
        let key = await ledger.getPublicKey(dPath, true, false)
        console.log('key', key)
      }
      catch (e) {
        console.log('failed to find ledger', e)
        this.$q.notify(this.$t('notifications.noLedger'))
      }
    },
    getAccounts (key, dPath, lastOne) {
      console.log('key', key)
      let payload = { public_key: key }
      this.$eos.getKeyAccounts(payload) // API to find accounts associated with a public key
        .then(response => {
          let accounts = response.account_names
          this.publicKeys.push({ key: key, accounts: accounts, dPath: dPath })

          for (var x of accounts) {
            this.accountNames.push(x)
          }
          this.loading = false

          if (lastOne && this.accountNames.length > 0) {
            // console.log('key', key, 'lastOne', lastOne)
            let arr = this.publicKeys.filter(x => x.accounts.length !== 0)
            // console.log('arr', arr)
            for (var y of arr) {
              // console.log(y)
              this.$q.notify({type: 'positive', message: this.$t('notifications.found', [ y.key ])})
            }
          }
          if (lastOne && this.accountNames.length === 0) {
            this.$q.notify({type: 'negative', message: this.$t('notifications.noAccountFound')})
          }
        })
        .catch(e => {
          console.log(e)
          this.loading = false
        })
    }
  },
  computed: {
    latestVersion () {
      let ver = this.ledger.appVersion.replace(/\./g, '')
      let latest = this.$route.meta.ledgerAppVersion.replace(/\./g, '')
      return (Number(ver) >= Number(latest))
    },
    objectEmpty () {
      return (Object.keys(this.publicKeys).length === 0 && this.publicKeys.constructor === Object)
    }
  }
}
</script>
<style lang="stylus">
@import '~variables'
  .pad-on-desk
    padding-left: 48px
    padding-right: 48px

  .patron-logo
    height 65px

  @media (max-width: 420px)
    .pad-on-desk
      padding-left: 0px
      padding-right: 0px
</style>
