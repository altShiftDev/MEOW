<template>
  <div class="row col-12 bg-white" style="position: relative;">
    <q-card inline class="q-pa-sm row items-center bg-white col no-wrap elipsis" style="height: auto">

      <q-card-title class="q-pb-none elipsis no-wrap self-center progress-bar-height-fix">

        <div class="row items-center justify-between fit">
<!--
          <div class="col-auto q-pr-md">
            <div class="col row items-center">
              <img class="col-auto on-left" style="height: 30px" type="image/svg+xml" src="statics/icons/eos.svg">
              <span class="col q-headline">{{ $route.meta.symbol }}</span>
            </div>
            <span class="col-auto q-card-subtitle">{{ $t('account.subtitle') }}</span>
          </div> -->

          <span class="row col-auto items-center q-pb-sm">
            <img v-if="$route.meta[$route.params.network].id === 'eos'" src="statics/icons/eos.svg" style="height: 30px" type="image/svg+xml" class="on-left col-auto"/>
            <img v-else :src="`statics/icons/${$route.meta[$route.params.network].id}.png`" style="height: 30px" type="image/png" class="on-left col-auto"/>
            <div class="col">
              <span class="q-headline">{{ $route.meta[$route.params.network].symbol }}</span>
              <span class="q-card-subtitle block" style="line-height: initial;">{{ $t('account.subtitle') }}</span>
            </div>
          </span>
          <div class="col"></div>
          <q-btn-toggle
            class="col-auto q-ma-xs"
            v-model="settings.showAirdrops"
            toggle-color="pink"
            :options="[
              {label: 'Airdrops', value: true},
              {label: 'Hide', value: false}
            ]"
            @input="$emit('updateSettings', settings)"
          />

          <q-btn-toggle v-if="$route.meta[$route.params.network].hasValue"
            class="col-auto q-ma-xs"
            v-model="settings.showUSD"
            toggle-color="primary"
            :options="[
              {label: $route.meta[$route.params.network].symbol, value: false},
              {label: 'USD', value: true}
            ]"
            @input="$emit('updateSettings', settings)"
          />

          <div class="col-12 inline-block self-center text-center q-mt-xs" style="height: 30px">

            <q-progress class="col inline-block" :percentage="100" :style="`width: calc(${Math.floor((resources.liquid / totalEOS) *100)}% - 10px)`" stripe animate style="min-width: 2%; max-width: 80%; height: 30px;"/>
            <q-popover anchor="bottom left" self="top left" class="bg-primary text-white">

              <q-list separator>
                <q-item dense v-close-overlay>
                  {{ $t('account.resources.availableEOS', [$route.meta[$route.params.network].symbol]) }}
                </q-item>
              </q-list>
            </q-popover>

            <q-progress class="col inline-block" :percentage="100" :style="`width: calc(${Math.floor((resources.netTotal / totalEOS) *100)}% - 15px)`" color="amber" stripe animate style="min-width: 2%; max-width: 80%; height: 30px;" />
            <q-popover anchor="top middle" self="bottom middle" class="bg-amber text-white">

              <q-list separator>
                <q-item dense v-close-overlay>
                  {{ $t('account.resources.netStake') }}
                </q-item>
              </q-list>
            </q-popover>

            <q-progress class="col inline-block" :percentage="100" :style="`width: calc(${Math.floor((resources.cpuTotal / totalEOS) *100)}% - 15px)`" color="yellow-10" stripe animate style="min-width: 2%; max-width: 80%; height: 30px;">
            </q-progress>
            <q-popover anchor="bottom right" self="top right" class="bg-yellow-10 text-white">

              <q-list separator>
                <q-item dense v-close-overlay>
                  {{ $t('account.resources.cpuStake') }}
                </q-item>
              </q-list>
            </q-popover>

            <q-progress v-if="resources.airdrops > 0 && settings.showAirdrops" class="col inline-block" :percentage="100" :style="`width: calc(${Math.floor((resources.airdrops / totalEOS) *100)}% - 10px)`" color="pink" stripe animate style="min-width: 2%; max-width: 80%; height: 30px;">
            </q-progress>
            <q-popover v-if="resources.airdrops > 0 && settings.showAirdrops" anchor="top right" self="bottom right" class="bg-pink text-white">

              <q-list separator>
                <q-item dense v-close-overlay>
                  Airdrops
                  <!-- {{ $t('account.resources.cpuStake') }} -->
                </q-item>
              </q-list>
            </q-popover>

          </div>

        </div>
      </q-card-title>

      <q-list highlight separator>

        <q-item class="text-primary">
          <!-- <q-item-side avatar="statics/eos-ram.vue.svg" class="meow-icon"/> -->
          <q-item-main :label="$t('account.resources.available')" label-lines="1" />
          <q-item-side right :stamp="settings.showUSD ? `$${ (resources.liquid * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.liquid * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.liquid.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}`" class="text-primary text-weight-bold"/>
        </q-item>

        <q-item>
          <!-- <q-item-side avatar="statics/net.svg" class="meow-icon"/> -->
          <q-item-main label-lines="2">
            <q-item-tile class="text-amber">
             {{ $t('account.resources.netStake') }}
            </q-item-tile>

            <template v-if="resources.netRefund > 0">
              <q-item-tile class="on-right" inverted stamp>
               <!-- {{ $t('account.resources.unstakingNET') }} -->
               Staked
              </q-item-tile>

              <q-item-tile class="on-right" inverted stamp>
               <!-- {{ $t('account.resources.unstakingNET') }} -->
               Unstaking
              </q-item-tile>
            </template>
          </q-item-main>

          <q-item-side right>
            <q-item-tile stamp class="text-amber text-weight-bold">
              {{ settings.showUSD ? `$${ (resources.netTotal * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.netTotal * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.netTotal.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
            </q-item-tile>

            <template v-if="resources.netRefund > 0">
              <q-item-tile stamp class="text-weight-light">
                {{ settings.showUSD ? `$${ (resources.netWeight * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.netWeight * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.netWeight.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
              </q-item-tile>
              <q-item-tile stamp class="text-weight-light">
                {{ settings.showUSD ? `$${ (resources.netRefund * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.netRefund * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.netRefund.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
              </q-item-tile>
            </template>

          </q-item-side>
        </q-item>

        <q-item>
          <!-- <q-item-side avatar="statics/cpu.svg" class="meow-icon"/> -->
          <q-item-main label-lines="2">
            <q-item-tile class="text-yellow-10">
             {{ $t('account.resources.cpuStake') }}
            </q-item-tile>

            <template v-if="resources.cpuRefund > 0">
              <q-item-tile class="on-right" inverted stamp>
               <!-- {{ $t('account.resources.unstakingNET') }} -->
               Staked
              </q-item-tile>

              <q-item-tile class="on-right" inverted stamp>
               <!-- {{ $t('account.resources.unstakingNET') }} -->
               Unstaking
              </q-item-tile>
            </template>
          </q-item-main>

          <q-item-side right>
            <q-item-tile stamp class="text-yellow-10 text-weight-bold">
              {{ settings.showUSD ? `$${ (resources.cpuTotal * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.cpuTotal * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.cpuTotal.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
            </q-item-tile>

            <template v-if="resources.cpuRefund > 0">
              <q-item-tile stamp class="text-weight-light">
                {{ settings.showUSD ? `$${ (resources.cpuWeight * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.cpuWeight * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.cpuWeight.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
              </q-item-tile>
              <q-item-tile stamp class="text-weight-light">
                {{ settings.showUSD ? `$${ (resources.cpuRefund * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.cpuRefund * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.cpuRefund.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}` }}
              </q-item-tile>
            </template>

          </q-item-side>
        </q-item>

        <q-item v-if="settings.showAirdrops" class="text-pink">
          <!-- <q-item-side avatar="statics/airdrops.svg" class="meow-icon"/> -->
          <q-item-main :label="$t('account.airdrops')" label-lines="1" />
          <q-item-side right :stamp="settings.showUSD ? `$${ (resources.airdrops * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.airdrops * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.airdrops.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta[$route.params.network].symbol}`" class="text-pink text-weight-bold"/>
        </q-item>

        <q-item class="text-deep-purple">
          <!-- <q-item-side avatar="statics/cpu.svg" class="meow-icon"/> -->
          <q-item-main :label="$t('account.resources.total')" label-lines="1" />
          <q-item-side right>
            <q-item-tile stamp class="text-deep-purple text-weight-bold">
              <!-- {{ settings.showUSD ? `$${ (resources.cpuTotal * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (resources.cpuTotal * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${resources.cpuTotal.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta.symbol}` }} -->
              <span v-if="settings.showUSD">$</span>
              <animated-count :value="settings.showUSD ? totalUSD : totalEOS "/>
              <span v-if="settings.showUSD"> USD</span>
              <span v-else> {{ $route.meta[$route.params.network].symbol }}</span>
            </q-item-tile>
          </q-item-side>
          <!-- <q-item-side right :stamp="settings.showUSD ? `$${ (totalEOS * eosPrice.USD).toLocaleString(undefined, { maximumFractionDigits: (totalEOS * eosPrice.USD) >= 1 ? 2 : 4 })} USD` : `${totalEOS.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${$route.meta.symbol}`" class="text-deep-purple text-weight-bold"/> -->
        </q-item>

      </q-list>

    </q-card>

    <div class="row col-12 q-py-xs" style="position: relative;">
      <q-card inline class="q-pa-sm row items-center bg-white col no-wrap elipsis second-card" style="height: auto">
        <q-card-title>
          <div class="col-auto q-pr-md">
            <div class="col row">
              <q-icon class="col-auto on-left" name="vpn_key"/>
              <span class="col q-headline">{{ $t('account.keys') }}</span>
            </div>
          </div>
        </q-card-title>
        <q-list no-border class="col-12 row justify-center">
          <q-item class="col-sm col-xs-12 text-center" v-for="(x, index) in accountData.permissions" :key="index">
            <q-item-main>
              <q-item-tile class="q-title text-weight-regular text-primary" label>
                <q-chip color="grey-5" small square>{{ x.perm_name }}</q-chip>
              </q-item-tile>
              <q-item-tile v-if="x.required_auth.keys.length > 0" sublabel class="break-n-wrap">
                <span class="font-weight-bold">{{ x.required_auth.keys[0].key }}</span>
              </q-item-tile>
              <q-item-tile v-else sublabel class="break-n-wrap">
                <span class="font-weight-bold">{{ x.required_auth.accounts[0].permission.actor}}</span>
                <span class="q-caption">@{{ x.required_auth.accounts[0].permission.permission }}</span>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <account-tokens v-if="$route.meta[$route.params.network].chain === 'EOS'" :loading="!tokenData" :tokenData="tokenData" :eosPrice="eosPrice" :settings="settings"/>
  </div>
</template>

<script>
import accountTokens from 'components/account-tokens.vue'
import animatedCount from 'components/utils/animated-count.vue'

export default {
  name: 'accountHistory',
  components: {
    accountTokens,
    animatedCount
  },
  props: ['accountData', 'totalBalance', 'resources', 'tokenData', 'eosPrice', 'settings'],
  data () {
    return {
      // showUSD: this.settings.showUSD,
      // showAirdrops: this.settings.showAirdrops
    }
  },
  watch: {
    // showUSD: function (newVal, oldVal) {
    //   this.initialize()
    // }
  },
  computed: {
    totalEOS () {
      let balance = this.settings.showAirdrops ? (this.totalBalance + this.resources.airdrops).toFixed(4) : this.totalBalance.toFixed(4)
      return Number(balance)
    },
    totalUSD () {
      let balance = (this.totalEOS * this.eosPrice.USD).toFixed(2)
      return Number(balance)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
.meow-icon img
  height: 30px
  vertical-align: middle

.second-card .q-card-container
  padding-bottom: 0px

.progress-bar-height-fix .col {
  flex-wrap: nowrap !important
}
</style>
