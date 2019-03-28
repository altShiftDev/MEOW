<template>
  <div class="row full-width justify-between q-my-md" style="position: relative;z-index: 9;">

    <q-card inline v-for="(x, index) in stats" :key="index" class="col-xs-12 col-md-4 col-lg-3 q-my-sm row justify-around bg-white col no-wrap elipsis" style="height: 170px">
      <q-card-title class="elipsis no-wrap">
        <div class="row no-wrap justify-between elipsis">

          <template v-if="x.title === 'RAM'">
            <span class="col">{{ $t('account.resources.availableRAM') }}</span>
            <q-btn class="col-auto" color="deep-purple" glossy dense @click="$emit('modifyRam')">
              <img style="height: 25px;" src="statics/ram.svg">
            </q-btn>
            <q-tooltip>Buy/Sell Ram</q-tooltip>
          </template>

          <template v-if="x.title === 'Network'">
            <span class="col">{{ $t('account.resources.availableNET') }}</span>
            <q-btn class="col-auto" color="deep-purple" glossy dense @click="$emit('modifyStake')">
              <img style="height: 25px;" src="statics/net.svg">
            </q-btn>
            <q-tooltip>Adjust Network Stake</q-tooltip>
          </template>

          <template v-if="x.title === 'CPU'">
            <span class="col">{{ $t('account.resources.availableCPU') }}</span>
            <q-btn class="col-auto" color="deep-purple" glossy dense @click="$emit('modifyStake')">
              <img style="height: 25px;" src="statics/cpu.svg">
            </q-btn>
            <q-tooltip>Adjust CPU Stake</q-tooltip>
          </template>
        </div>
        <span slot="subtitle" class="elipsis">
         {{ $t('account.resources.percentUsed', [ byteConverter(x.used, (x.title === 'CPU')), byteConverter(x.max, (x.title === 'CPU')) ]) }}
        </span>
      </q-card-title>

      <div class="col-auto text-center">
        <q-knob readonly
          v-model="x.percent"
          size="75px"
          style="font-size: 1.5rem"
          :color="x.color"
          track-color="grey-1"
          line-width="4px"
          :min="0"
          :max="100"
        >
          {{ x.percent }}%
        </q-knob>
      </div>
    </q-card>

  </div>
</template>

<script>

export default {
  name: 'accountResources',
  props: ['accountData'],
  data () {
    return {
      stats: {
        ram: {
          title: 'RAM',
          icon: 'sd_card',
          color: 'deep-purple',
          percent: 0,
          used: 0,
          max: 0
        },
        net: {
          title: 'Network',
          icon: 'wifi',
          color: 'amber',
          percent: 0,
          used: 0,
          max: 0
        },
        cpu: {
          title: 'CPU',
          icon: 'computer',
          color: 'yellow-10',
          percent: 0,
          used: 0,
          max: 0
        }
      }
    }
  },
  watch: {
    accountData: function (newVal, oldVal) {
      this.updateStats(newVal)
    }
  },
  methods: {
    updateStats (data) {
      let ramStats = (100 - (data.ram_usage / data.ram_quota) * 100).toFixed(0)
      let netStats = (100 - (data.net_limit.used / data.net_limit.max) * 100).toFixed(0)
      let cpuStats = (100 - (data.cpu_limit.used / data.cpu_limit.max) * 100).toFixed(0)

      let ram = {
        title: this.stats.ram.title,
        icon: this.stats.ram.icon,
        color: this.stats.ram.color,
        percent: Number(ramStats),
        used: data.ram_usage,
        max: data.ram_quota
      }
      let net = {
        title: this.stats.net.title,
        icon: this.stats.net.icon,
        color: this.stats.net.color,
        percent: Number(netStats),
        used: data.net_limit.used,
        max: data.net_limit.max
      }
      let cpu = {
        title: this.stats.cpu.title,
        icon: this.stats.cpu.icon,
        color: this.stats.cpu.color,
        percent: Number(cpuStats),
        used: data.cpu_limit.used,
        max: data.cpu_limit.max
      }
      this.stats.ram = ram
      this.stats.net = net
      this.stats.cpu = cpu
    },
    byteConverter (val, cpu = false) {
      let prefix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let cpuPrefix = ['µs', 'ms', 'cs', 'ds', 's', 'das']
      let index = 0
      let byteUpgrader = function (val, cpu) {
        return !cpu ? (val / 1024) : (val / 1000)
      }
      while (val > 500 && index < 5) {
        val = byteUpgrader(val, cpu)
        index++
      }
      return !cpu ? `${val.toFixed(2)} ${prefix[index]}` : `${val.toFixed(2)} ${cpuPrefix[index]}`
    }
  },
  mounted () {
    this.updateStats(this.accountData)
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
