<template>
  <q-layout view="lHh Lpr lFf">

    <q-layout-header v-if="!$q.platform.within.iframe">
      <q-toolbar color="grey-9">
        <q-toolbar-title class="row col items-center">
          <q-btn :to="`/${$route.params.network ? $route.params.network : 'eos' }`" flat dense class="q-py-none">
            <img alt="altShiftDev logo" style="height: 35px;" src="statics/altshiftdev_logo.svg">
          </q-btn>
          <span v-if="$route.params.accountName" class="q-ml-sm">{{ $route.params.accountName }}
            <q-chip small :dense="(windowWidth < 450)" v-if="isProxy">Voting Proxy</q-chip>
            <q-chip small :dense="(windowWidth < 450)" v-if="isProducer">Block Producer</q-chip>
            <q-chip small :dense="(windowWidth < 450)" v-if="isAltShiftDev">altShiftDev</q-chip>
          </span>
          <span v-else class="q-ml-sm site-title q-headline text-weight-light">My EOS
            <span :class="{ 'text-strike': $route.path.includes('blog') }"> Wallet</span>
            <span v-if="$route.path.includes('blog')"> Blog</span>
          </span>

        </q-toolbar-title>

        <q-btn-dropdown v-if="!$route.path.includes('blog')" class="col-auto hide-label-xs" :icon="defaultAPI === recommendedEndpoint.value ? 'cloud_done' : 'cloud_queue'" :label="currentAPI()" flat no-caps>

          <q-list v-if="$route.params.network === 'eos' || !$route.params.network" link>
            <q-list-header>Recommended API</q-list-header>
            <q-item v-close-overlay @click.native="defaultAPI = recommendedEndpoint.value; updateURL(recommendedEndpoint.value)">
              <!--<q-item-side :icon="recommendedEndpoint.icon" color="deep-purple"/>-->
              <q-item-side icon="check" v-if="recommendedEndpoint.value === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset label="Block Matrix Proxy"/>
            </q-item>
          </q-list>

          <q-list v-if="$route.params.network === 'eos' || !$route.params.network" link>
            <q-list-header>
              <img src="statics/icons/eos.svg" type="image/svg+xml" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.main') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.eos" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

          <!-- telos net -->
          <q-list v-if="$route.params.network === 'telos'" link>
            <q-list-header>
              <img src="statics/icons/telos.png" type="image/png" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.telos') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.telos" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

          <!-- worbli mainnet-->
          <q-list v-if="$route.params.network === 'worbli'" link>
            <q-list-header>
              <img src="statics/icons/worbli.png" type="image/png" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.worbli') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.worbli" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

          <!-- bos mainnet-->
          <q-list v-if="$route.params.network === 'bos'" link>
            <q-list-header>
              <img src="statics/icons/bos.png" type="image/png" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.bos') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.bos" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

          <!-- jungle net v2 -->
          <q-list v-if="$route.params.network === 'jungle'" link>
            <q-list-header>
              <img src="statics/icons/jungle.png" type="image/png" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.jungleTest') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.jungle" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

          <!-- cyptokylin net -->
          <q-list v-if="$route.params.network === 'cryptokylin'" link>
            <q-list-header>
              <img src="statics/icons/cryptokylin.png" type="image/png" class="on-left api-image"/>
              <span class="api-network">{{ $t('api.kylinTest') }}</span>
            </q-list-header>
            <q-item v-for="(x, index) in allEndpoints.cryptokylin" :key="index" v-close-overlay @click.native="defaultAPI = x; updateURL(x)">
              <q-item-side icon="check" v-if="x === $eos.config.httpEndpoint" color="primary" />
              <q-item-main inset>
                <q-item-tile label>{{ x.replace('https://','').split(/[/?#]/)[0] }}</q-item-tile>
                <!--<q-item-tile sublabel>{{ x }}</q-item-tile>-->
              </q-item-main>
            </q-item>
          </q-list>

        </q-btn-dropdown>

        <q-btn-dropdown class="col-auto hide-label-xs" icon="language" :label="$t('lang')" flat no-caps>
          <q-list link>
            <q-item v-for="(x, index) in supportedLanguages" :key="index" v-close-overlay @click.native="$i18n.locale = x.value">
              <q-item-main>
                <q-item-tile label>{{ x.label }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view :defaultAPI="defaultAPI" :allEndpoints="allEndpoints" v-on:isProxy="proxyToggle" v-on:isProducer="producerToggle" v-on:changeAPI="changeAPI" :key="$route.params.accountName"/>
    </q-page-container>

    <q-layout-footer v-if="!$q.platform.within.iframe">
      <q-toolbar color="grey-9" class="justify-between">

        <div class="col q-caption">
          <span class="gt-sm">© {{ (new Date()).getFullYear() }} altShiftDev</span>
          <span class="lt-md absolute-center" style="top: 43px;">© {{ (new Date()).getFullYear() }} altShiftDev</span>
        </div>

        <!-- <div class="row col-auto justify-around"> -->
        <!--<q-btn class="col-auto" dense no-caps flat @click="openURL('https://www.patreon.com/altshiftdev')">-->
          <!--<img class="on-left gt-xs" alt="patreon logo" style="height: 20px; width: 20px;" src="statics/patreon.svg" />-->
          <!--<span>{{ $t('buttons.patreon') }}</span>-->
        <!--</q-btn>-->

        <!--<div class="col"></div>-->

        <!--<q-btn class="col-auto" dense small no-caps flat to="/eos/account/meow.x/">-->
          <!--<img class="on-left gt-xs" alt="You can donate EOS to account meow.x to support this site" style="height: 20px; width: 20px;" src="statics/icons/eos.svg" />-->
          <!--<span>{{ $t('buttons.donate') }}</span>-->
        <!--</q-btn>-->
        <!--<span class="col-auto text-center">MEOW is made possible by sponsors and user donations to EOS account <q-btn color="grey" dense link to="/eos/account/meow.x/" no-caps>meow.x</q-btn></span>-->
        <span class="col-auto q-body-1 text-center">Donations welcome @ <q-btn color="grey" dense link to="/eos/account/meow.x/" no-caps>meow.x</q-btn></span>
        <!-- </div> -->

        <div class="col text-right">
          <q-btn dense small no-caps type="a" link flat target="_blank" href="https://t.me/meow_eos/">
            <img alt="Telegram MEOW" style="height: 20px; width: 20px;" src="statics/social/telegram.svg" />
          </q-btn>
          <q-btn dense small no-caps type="a" link flat target="_blank" href="https://twitter.com/@altShiftDev1/">
            <img alt="Twitter MEOW" style="height: 20px; width: 20px;" src="statics/social/twitter.svg" />
          </q-btn>
        </div>

       <!--  <q-btn class="col-auto" no-caps flat @click="openURL('https://github.com/altShiftDev/MEOW')">
          <img class="on-left" alt="github logo" style="height: 20px; width: 23px;" src="statics/github.svg" />
          <span>Support MEOW on github!</span>
        </q-btn> -->
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  meta () {
    return {
      title: this.$route.params.accountName ? `${this.$route.params.accountName} ${this.$route.meta[this.$route.params.network ? this.$route.params.network : 'eos'].chain} Account` : this.$route.path.includes('blog') ? `MEOW Blog` : `Ledger ${this.$route.meta[this.$route.params.network ? this.$route.params.network : 'eos'].chain} Wallet & Account Viewer`,
      titleTemplate: title => `${title} | My EOS Wallet | MEOW`
    }
  },
  data () {
    return {
      defaultAPI: this.$route.path.includes('blog') ? '' : this.$eos.config.httpEndpoint,
      recommendedEndpoint: {
        sublabel: 'Node Tools by Block Matrix will automatically select the fastest API for you.',
        value: 'https://proxy.eosnode.tools',
        icon: 'signal_wifi_4_bar_lock'
      },
      allEndpoints: {
        eos: ['https://eos.greymass.com:443', 'https://eosapi.blockmatrix.network:443', 'https://node1.eosphere.io', 'https://user-api.eoseoul.io:443', 'https://api.eosn.io', 'https://api.main.alohaeos.com:443'],
        jungle: ['https://api.jungle.alohaeos.com'],
        telos: ['https://telos.greymass.com', 'https://telos.eosphere.io', 'https://api.eos.miami'],
        bos: ['https://bos.eosphere.io', 'https://hapi.bos.eosrio.io'], // telosTestnet: ['https://api.eos.miami:17441'],
        cryptokylin: ['https://api-kylin.eosasia.one', 'https://api-kylin.eoslaomao.com:443'],
        worbli: ['https://worbli.eosphere.io:443', 'https://endpoint-1.worbli.io']
      },
      isProxy: false,
      isProducer: false,
      windowWidth: window.innerWidth,
      supportedLanguages: [
        {
          label: 'english',
          value: 'en-us'
        },
        {
          label: 'русский',
          value: 'ru-ru'
        }
      ]
    }
  },
  methods: {
    openURL,
    updateURL (api) {
      this.$router.replace({ query: { api: api } })
    },
    proxyToggle (val) {
      this.isProxy = val
    },
    producerToggle (val) {
      this.isProducer = val
    },
    changeAPI (val) {
      console.log('change api', this.defaultAPI, val)
    },
    currentAPI () {
      this.defaultAPI = this.$eos.config.httpEndpoint
      return this.$eos.config.httpEndpoint.replace('https://', '').split(/[/?#]/)[0]
    }
  },
  computed: {
    isAltShiftDev () {
      return (this.$route.params.accountName === 'meow.x')
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
  @media (max-width: 450px)
    #q-app .q-toolbar-title
      padding-left 0

  @media (max-width: 750px)
    #q-app .q-btn-dropdown .q-btn-inner .q-btn-dropdown-arrow
      display none

  @media (max-width: 600px)
    #q-app .q-btn-dropdown.hide-label-xs .q-btn-inner div
      display none
    #q-app i.on-left
      margin-right: unset

  @media (max-width: 420px)
    .site-title
      display none

  .api-image
    height 30px
    vertical-align middle
  /*.api-network*/
    /*vertical-align middle*/

  /*.q-item-section + .q-item-section*/
    /*margin-left: unset*/

  .text-strike
    text-decoration: line-through
</style>
