<template>
  <div class="col-12">
    <div id="meow-contract-helper" class="row col-12 justify-around items-center text-center bg-black relative-position" :estimate="updateEstimate">
      <template v-if="!status.signRequested">
        <div class="col-6 row items-center justify-center q-pa-sm">
          <div class="col-12 row">
            <span class="col-12">Available</span>
          </div>
          <q-knob readonly class="col-auto q-my-xs"
            v-model="currentUsage"
            size="50px"
            style="font-size: 1.1rem"
            color="white"
            track-color="grey-9"
            line-width="3px"
            :min="0"
            :max="100"
          >
            {{ currentUsage }}%
          </q-knob>
          <span class="col-12 text-grey">{{ $t('account.resources.percentUsed', [ byteConverter(accountData.ram_usage), byteConverter(accountData.ram_quota) ]) }}</span>
        </div>

        <div class="col-6 row items-center justify-center q-pa-sm">
          <div class="col-12 row">
            <span class="col-12">Projected</span>
          </div>
          <q-knob readonly class="col-auto q-my-xs"
            v-model="projectedUsage"
            size="50px"
            style="font-size: 1.1rem"
            color="white"
            track-color="grey-9"
            line-width="3px"
            :min="0"
            :max="100"
          >
            {{ projectedUsage }}%
          </q-knob>
          <span class="col-12 text-grey">{{ $t('account.resources.percentUsed', [ byteConverter(accountData.ram_usage), byteConverter((buysellram.fields.buyOrSell.default !== 'sellram') ? accountData.ram_quota + buysellram.fields.bytes.default : accountData.ram_quota - buysellram.fields.bytes.default) ]) }}</span>
        </div>
      </template>
      <eos-transaction-status v-else :status="status" :ledger="ledger"/>
    </div>

    <!-- contract text -->
    <div class="row items-center q-px-md">
      <span class="col-auto">I'm </span>
      <span class="col-auto">
        <q-select dark
          class="q-mx-sm"
          no-icon
          no-parent-field
          color="secondary"
          v-model="buysellram.fields.buyOrSell.default"
          radio
          :options="buysellram.fields.buyOrSell.options"
          @input="updateContract(buysellram.fields.buyOrSell.default)"
        />
      </span>

      <span class="col-auto">
        <q-input dark
         class="q-mx-sm" color="secondary" align="right" type="number"
         :min="1" :decimals="0"
         v-model.number="buysellram.fields.bytes.default"
         :placeholder="buysellram.fields.bytes.placeholder"
         :suffix="buysellram.fields.bytes.suffix"
         :style="{ maxWidth: maxWidth(buysellram.fields.bytes.default, buysellram.fields.bytes.error, 'Bytes', buysellram.fields.bytes.placeholder, buysellram.fields.bytes.suffix) + 'px' }"
         :error="buysellram.fields.bytes.error"
         :after="[{
          icon: 'warning',
          error: true,
          handler () {}
        }]"
        />
      </span>
      <span
        v-if="buysellram.fields.buyOrSell.default !== 'sellram'"
        class="col-auto q-px-xs"
      >
        of RAM for account
      </span>

      <span
        v-if="buysellram.fields.buyOrSell.default !== 'sellram'"
        class="col-auto"
      >
        <q-input dark
         class="q-mx-sm" color="secondary" align="right"
         v-model.trim="buysellram.fields.receiver.default"
         :placeholder="buysellram.fields.receiver.placeholder"
         :style="{ maxWidth: maxWidth(buysellram.fields.receiver.default, buysellram.fields.receiver.error, '.', buysellram.fields.receiver.placeholder, buysellram.fields.receiver.suffix) + 'px' }"
         :suffix="buysellram.fields.receiver.suffix"
         :error="buysellram.fields.receiver.error"
         :after="[{
          icon: 'warning',
          error: true,
          handler () {}
        }]"
        />
      </span>

      <span
        v-else
        class="col-auto"
      >
        of RAM.
      </span>
    </div>
  </div>
</template>

<script>
import eosTransactionStatus from 'components/utils/eos-transaction-status.vue'
export default {
  name: 'RAM',
  components: {
    eosTransactionStatus
  },
  props: ['accountData', 'eosPrice', 'maxWidth', 'byteConverter', 'handleSuccess', 'handleFailure', 'status', 'ledger'],
  data () {
    return {
      currentUsage: 0,
      projectedUsage: 0,
      subtitle: `RAM costs ~${this.eosPrice.ramEOS} EOS or ~$${this.eosPrice.ramUSD} USD per 1024 Bytes`,
      buysellram: {
        fields: {
          buyOrSell: {
            options: [
              {
                label: 'buying',
                value: 'buyrambytes'
              },
              {
                label: 'selling',
                value: 'sellram'
              }
            ],
            default: this.$route.params.contract === 'buyrambytes' ? 'buyrambytes' : 'sellram',
            placeholder: '',
            error: false,
            helper: ''
          },
          receiver: {
            label: 'Receiver',
            default: this.$route.params.accountName,
            placeholder: 'meow.x',
            suffix: '.',
            error: false,
            helper: ''
          },
          bytes: {
            label: 'Bytes',
            default: 1024,
            placeholder: '1024',
            suffix: 'Bytes',
            error: false,
            helper: 'RAM is calculated in Bytes (B), 1024 B = 1 KB, it\'s recommended to have at least 4096 B (4 KB) of RAM for your account but 8192 B (8 KB) is safer.'
          }
        },
        showVideo: false,
        videoURL: 'https://www.youtube.com/embed/_om_RpVCDAQ?rel=0',
        helper: 'The prices fluctuate based on supply and demand so you should research the price of RAM before running this function as you may not receive as much EOS as you expect for your RAM.'
      }
    }
  },
  computed: {
    updateEstimate () {
      // console.log('updateEstimate', this.eosPrice.ramUSD, this.eosPrice.ramEOS)
      let amount = this.buysellram.fields.bytes.default
      let costUSD = ((amount * this.eosPrice.ramUSD) / 1024).toFixed(4)
      let costEOS = ((amount * this.eosPrice.ramEOS) / 1024).toFixed(4)
      let projected = (this.buysellram.fields.buyOrSell.default !== 'sellram') ? `Estimated cost for buying ${amount} Bytes/RAM: ~${costEOS} EOS / ~$${costUSD} USD` : `Estimated return for selling ${amount} Bytes/RAM: ~${costEOS} EOS / ~$${costUSD} USD`
      let err = `Enter an amount of RAM in Bytes to calculate costs/returns`

      let estimate = (amount === null) ? `${err}` : `${projected}`
      this.ramUsage()
      this.$emit('updateEstimate', estimate)
      return estimate
    }
  },
  mounted () {
    this.ramUsage()
    this.$emit('updateSubtitle', this.subtitle)
  },
  methods: {
    ramUsage () {
      // console.log('ramUsage', this.accountData)
      let currentUsage = (100 - (this.accountData.ram_usage / this.accountData.ram_quota) * 100).toFixed(0)
      this.currentUsage = Number(currentUsage)
      // console.log(this.accountData.ram_quota, this.buysellram.fields.bytes.default)
      let newQuota = (this.buysellram.fields.buyOrSell.default !== 'sellram') ? (this.accountData.ram_quota + this.buysellram.fields.bytes.default) : (this.accountData.ram_quota - this.buysellram.fields.bytes.default)
      let projectedUsage = newQuota > this.accountData.ram_usage ? (100 - (this.accountData.ram_usage / newQuota) * 100).toFixed(0) : 0
      this.projectedUsage = Number(projectedUsage)
      // console.log('projectedUsage', this.projectedUsage)
    },
    updateContract (newVal) {
      console.log('change', newVal)
      // this.$route.params.contract = this.buysellram.fields.buyOrSell.default
      this.$router.push(`/${this.$route.params.network}/api/${this.$route.params.accountName}/${this.$route.params.dPath}/${this.$route.params.authority}/${newVal}/`)
      console.log('new contract', this.$route.params.contract)
    },
    async generatePayload () {
      console.log('generatePayload requested')
      let p = this.buysellram.fields.buyOrSell.default === 'buyrambytes' ? {
        payer: this.$route.params.accountName,
        receiver: this.buysellram.fields.receiver.default,
        bytes: this.buysellram.fields.bytes.default
      } : {
        account: this.$route.params.accountName,
        bytes: this.buysellram.fields.bytes.default
      }
      console.log('payload', p)
      try {
        let r = this.buysellram.fields.buyOrSell.default === 'buyrambytes' ? await this.$eos.buyrambytes(p) : await this.$eos.sellram(p)
        console.log(`successfully generated P for ${this.buysellram.fields.buyOrSell.default}`)
        this.handleSuccess(r)
      }
      catch (e) {
        console.log(`failure to generate P for ${this.buysellram.fields.buyOrSell.default}`)
        this.status.validated = false // transaction is invalid
        this.handleFailure(e)
      }
      // this.buysellram.fields.buyOrSell.default === 'buyrambytes' ? this.$eos.buyrambytes(p) : this.$eos.sellram(p)
      //   .then(r => {
      //     // this.status.ledgerRequiresArbitrary = true
      //     this.handleSuccess(r)
      //   })
      //   .catch(e => {
      //     this.status.validated = false // transaction is invalid
      //     this.handleFailure(e)
      //   })
    }
  }
}
</script>

<style lang="stylus">

</style>
