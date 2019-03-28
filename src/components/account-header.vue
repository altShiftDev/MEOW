<template>
  <div class="bg-grey-2" style="height: 200px; overflow: hidden;">
    <div style="height: 200px">

      <div class="absolute self-center text-white" style="position: fixed;left: 0%;right: 0%;margin-left: auto;margin-right: auto;top: 105px;text-align: center;z-index: 1;">
        <p class="col-12 self-center q-display-2" v-if="totalBalance">
          <animated-count :value="balance"/>
          <span class="q-display-1"> {{ $route.meta[$route.params.network].symbol }}</span>
        </p>

        <p v-if="$route.meta[$route.params.network].hasValue" class="col-12 self-start q-headline">
          $<animated-count :value="totalPrice" currency="USD"/>
          <span class="q-headline"> USD</span>
        </p>
        <p v-else>
          {{ `Welcome to ${$route.meta[$route.params.network].chain}` }}
        </p>
      </div>

      <div class="row col-12 justify-around text-center hero-animation">
        <div :class="`${$route.meta[$route.params.network].id}-wave`"></div>
        <div :class="`${$route.meta[$route.params.network].id}-wave`"></div>
      </div>

    </div>
  </div>
</template>

<script>
import animatedCount from 'components/utils/animated-count.vue'
export default {
  name: 'accountHeader',
  props: ['totalBalance', 'eosPrice', 'airdrops', 'settings'],
  components: {
    animatedCount
  },
  data () {
    return {
    }
  },
  methods: {
    // goodOrBad (value) {
    //   return value.toString().indexOf('-', 0)
    // }
    // networkWave () {
    //   // let chainId = this.$eos.config.chainId
    //   return this.$route.symbol
    //   // if (chainId === 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473') {
    //   //   return message ? 'Welcome to the Jungle' : 'jungle-wave'
    //   // }
    //   // if (chainId === '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191') {
    //   //   return message ? 'Welcome to CryptoKylin' : 'kylin-wave'
    //   // }
    //   // if (chainId === '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f') {
    //   //   return message ? 'Welcome to Worbli' : 'worbli-wave'
    //   // }
    // }
  },
  computed: {
    balance () {
      let balance = this.settings.showAirdrops ? (this.totalBalance + this.airdrops).toFixed(4) : this.totalBalance.toFixed(4)
      let totalBalance = Number(balance)
      return totalBalance
    },
    totalPrice () {
      let balance = this.settings.showAirdrops ? (this.totalBalance + this.airdrops) : this.totalBalance
      let total = (balance * this.eosPrice.USD).toFixed(2)
      return Number(total) || 0
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus">
@import '~variables'

.hero-animation
  background $grey-8

.hero-animation
  overflow: hidden;

.eos-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/eos.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.eos-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

.jungle-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/jungle.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.jungle-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

.cryptokylin-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/cryptokylin.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.cryptokylin-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

.telos-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/telos.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.telos-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

.worbli-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/worbli.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.worbli-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

.bos-wave {
  z-index 0
  overflow: hidden
  background: url(/statics/waves/bos.svg) repeat-x;
  position: relative;
  top: 0px;
  width: 6400px;
  height: 198px;
  animation: wave 10s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.bos-wave:nth-of-type(2) {
  z-index 2
  top: -125px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 5s ease -1.25s infinite;
  opacity: 1;
}

@keyframes wave {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -1600px;
  }
}

@keyframes swell {
  0%, 100% {
    transform: translate3d(0,-25px,0);
  }
  50% {
    transform: translate3d(0,5px,0);
  }
}
</style>
