<template>
  <div class="col-12">
    <div id="meow-contract-helper" class="scroll row col-12 justify-around items-center text-center bg-black relative-position" :estimate="updateEstimate">
      <template v-if="!status.signRequested">

        <div class="col-6 row items-center justify-center q-pa-sm">
          <div class="col-12 row">
            <span class="col-12">Available Balance</span>
          </div>
          <q-knob readonly class="col-auto q-my-xs"
            v-model="currentUsage"
            size="50px"
            style="font-size: 1.1rem"
            color="secondary"
            track-color="transparent"
            line-width="3px"
            :min="0"
            :max="currentUsage"
          >
            <span class="text-white text-weight-bold">{{ currentUsage.toLocaleString(undefined, { maximumFractionDigits: precision }) }}</span>
          </q-knob>
          <span class="col-12 text-grey">{{ transfer.fields.token.default }}</span>
        </div>

        <div class="col-6 row items-center justify-center q-pa-sm">
          <div class="col-12 row">
            <span class="col-12">Projected Balance</span>
          </div>
          <q-knob readonly class="col-auto q-my-xs"
            v-model="projectedUsage"
            size="50px"
            style="font-size: 1.1rem"
            color="secondary"
            track-color="transparent"
            line-width="3px"
            :min="0"
            :max="currentUsage"
          >
            <span class="text-white text-weight-bold">{{ projectedUsage.toLocaleString(undefined, { maximumFractionDigits: precision }) }}</span>
          </q-knob>
          <span class="col-12 text-grey">{{ transfer.fields.token.default }}</span>
        </div>
      </template>
      <eos-transaction-status v-else :status="status" :ledger="ledger"/>
    </div>

    <!-- contract text -->
    <div class="row items-center q-px-md">
      <span class="col-auto">I'm transferring</span>

      <span class="col-auto">
        <q-input dark
         class="q-mx-sm" color="secondary" align="right" type="number"
         :min="minimumValue" :decimals="precision"
         v-model.number="transfer.fields.quantity.default"
         :placeholder="transfer.fields.quantity.placeholder"
         :style="{ maxWidth: maxWidth(transfer.fields.quantity.default, transfer.fields.quantity.error, 'Bytes', transfer.fields.quantity.placeholder, transfer.fields.quantity.suffix) + 'px' }"
         :error="transfer.fields.quantity.error"
         :after="[{
          icon: 'warning',
          error: true,
          handler () {}
         }]"
        />

      </span>
      <q-select dark
        class="q-mx-sm"
        no-icon
        no-parent-field
        color="secondary"
        v-model="transfer.fields.token.default"
        :options="transfer.fields.token.options"
        @input="updateSubtitle"
      />
      <span
        class="col-auto q-px-xs"
      >
        to account
      </span>

      <span
        class="col-auto"
      >
        <q-input dark
         class="q-mx-sm" color="secondary" align="right"
         v-model.trim="transfer.fields.to.default"
         :placeholder="transfer.fields.to.placeholder"
         :style="{ maxWidth: maxWidth(transfer.fields.to.default, transfer.fields.to.error, '.', transfer.fields.to.placeholder, transfer.fields.to.suffix) + 'px' }"
         :suffix="transfer.fields.to.suffix"
         :error="transfer.fields.to.error"
         :after="[{
          icon: 'warning',
          error: true,
          handler () {}
         }]"
        />
      </span>

      <span
        class="col-auto q-px-xs"
      >
        with memo
      </span>

      <span

        class="col-auto"
      >
        <q-input dark
          class="col-auto"
          color="secondary"
          v-model.trim="transfer.fields.memo.default"
          :style="{ width: maxWidth(transfer.fields.memo.default, transfer.fields.memo.error, '.', transfer.fields.memo.placeholder) + 'px' }"
          :placeholder="transfer.fields.memo.placeholder"
          style="maxWidth: 500px"
          :error="transfer.fields.memo.error"
          :after="[{
            icon: 'warning',
            error: true,
            handler () {}
          }]"
        />
      </span>
    </div>
  </div>
</template>

<script>
import eosTransactionStatus from 'components/utils/eos-transaction-status.vue'
import { modules } from 'eosjs'
const DecimalPad = modules.format.DecimalPad
export default {
  name: 'RAM',
  components: {
    eosTransactionStatus
  },
  props: ['accountData', 'resources', 'tokenData', 'eosPrice', 'maxWidth', 'handleSuccess', 'handleFailure', 'status', 'ledger'],
  data () {
    return {
      currentUsage: 0,
      projectedUsage: 0,
      subtitle: `EOS is worth ~$${this.eosPrice.USD.toFixed(4)} USD right now`,
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
            default: this.$route.query.to || '',
            placeholder: 'meow.x',
            error: false,
            helper: ''
          },
          quantity: {
            label: 'Quantity',
            default: this.$route.query.quantity || 1.0000,
            placeholder: '',
            error: false,
            helper: '',
            icon: 'attach_money'
          },
          token: {
            label: 'Token',
            default: this.$route.query.token ? this.$route.query.token.toUpperCase() : this.$route.meta[this.$route.params.network].symbol,
            options: [{
              label: this.$route.meta[this.$route.params.network].symbol,
              value: this.$route.meta[this.$route.params.network].symbol,
              avatar: `statics/icons/eos.svg?v=1`,
              inset: true,
              contract: 'eosio.token',
              price: this.eosPrice.USD,
              usd_value: this.eosPrice.USD * this.resources.liquid,
              precision: this.$route.meta[this.$route.params.network].precision,
              balance: this.resources.liquid,
              sublabel: `${this.resources.liquid.toFixed(this.$route.meta[this.$route.params.network].precision).toString()} ${this.$route.meta[this.$route.params.network].symbol}`
            }],
            placeholder: '',
            error: false,
            helper: 'Make sure to select a token you actually have or the transaction will fail'
          },
          memo: {
            label: 'Memo',
            default: this.$route.query.memo || '',
            placeholder: '(optional memo)',
            error: false,
            helper: 'Memo\'s are usually optional but if you\'re sending money to a contract or exchange it may be a required field',
            icon: 'add_comment'
          }
        }
      }
    }
  },
  computed: {
    updateEstimate () {
      let amount = this.transfer.fields.quantity.default
      let token = this.transfer.fields.token.options.filter(x => x.value === this.transfer.fields.token.default)
      token = token[0]
      let costUSD
      let projected
      let err
      if (!token) {
        projected = `Could not find token: ${this.transfer.fields.token.default}`
      }
      else if (!token.price) {
        projected = `No pricing data available for ${this.transfer.fields.token.default}`
      }
      else {
        costUSD = (amount * token.price).toFixed(token.precision)
        projected = `Estimated cost for transferring ${amount} ${this.transfer.fields.token.default}: ~$${costUSD} USD`
        err = `Enter an amount of ${this.transfer.fields.token.default} to calculate costs/returns`
      }
      let estimate = (amount === null) ? `${err}` : `${projected}`
      this.usageHelper()
      this.$emit('updateEstimate', estimate)
      return estimate
    },
    minimumValue () {
      // console.log('default', this.transfer.fields.token.default)
      // console.log('options', this.transfer.fields.token.options)
      let r = this.transfer.fields.token.options.filter(x => (x.value === this.transfer.fields.token.default))
      if (r.length === 1) {
        r = r[0]
        let base = [0.1, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]
        let min = (0.1 / base[r.precision ? r.precision : 0])
        // console.log(`min= ${min}`)

        // console.log('current', this.transfer.fields.quantity.default, r.precision)
        this.transfer.fields.quantity.default = (Math.round(base[r.precision ? r.precision + 1 : 1] * this.transfer.fields.quantity.default) / base[r.precision ? r.precision + 1 : 1]).toFixed(r.precision)
        // console.log('shouldBe', this.transfer.fields.quantity.default)
        return min
      }
      // console.log('r', r)
      return 0.0001
    },
    precision () {
      let r = this.transfer.fields.token.options.filter(x => (x.value === this.transfer.fields.token.default))
      if (r.length === 1) {
        r = r[0]
        // console.log('precision', r.precision)
        // DecimalPad(this.transfer.fields.quantity.default, r.precision)
        return r.precision
      }
    }
    // subtitle () {
    //
    // }
  },
  beforeMount () {
    // this.$emit('updateSubtitle', this.subtitle)
    this.transfer.fields.token.options = this.transfer.fields.token.options.concat(this.tokenData)
    this.updateSubtitle(this.transfer.fields.token.default)
    console.log('options', this.transfer.fields.token.options)
    console.log('tokenData', this.tokenData)
  },
  mounted () {
    this.usageHelper()
  },
  methods: {
    usageHelper () {
      let token = this.transfer.fields.token.options.filter(x => x.value === this.transfer.fields.token.default)
      if (token.length === 0) {
        this.transfer.fields.token.default = this.$route.meta[this.$route.params.network].symbol
        return
      }
      let currentUsage = token[0].balance
      this.currentUsage = Number(currentUsage)
      let projectedUsage = token[0].balance - this.transfer.fields.quantity.default
      this.projectedUsage = Number(projectedUsage)
    },
    updateSubtitle (newVal) {
      if (newVal === 'EOS') {
        this.$emit('updateSubtitle', `EOS is worth ~$${this.eosPrice.USD.toFixed(4)} USD right now`)
      }
      else {
        let x = this.transfer.fields.token.options.filter(x => (newVal === x.value))
        if (x.length === 1) {
          x = x[0]
          let msg = x.price ? `${x.value} is worth ~$${x.price.toFixed(6)} USD right now` : `No pricing data available for ${x.value}`
          this.$emit('updateSubtitle', msg)
        }
      }
    },
    async generatePayload () {
      console.log('generatePayload requested')
      let p = {
        from: this.transfer.fields.from.default,
        to: this.transfer.fields.to.default,
        quantity: `${DecimalPad(this.transfer.fields.quantity.default, this.precision)} ${this.transfer.fields.token.default.toUpperCase()}`,
        memo: this.transfer.fields.memo.default
      }

      console.log('payload', p)
      // this.$eos.transfer(p)
      // let currentSymbol = this.transfer.fields.token.default.toUpperCase()
      // const contracts = balances.contracts
      const account = this.transfer.fields.token.options.filter(z => (this.transfer.fields.token.default === z.value))
      let options = { authorization: [`${this.$route.params.accountName}@${this.$route.params.authority}`] }
      this.$eos.transaction(account[0].contract, contract => {
        contract.transfer(p.from, p.to, p.quantity, p.memo, options)
      }, { broadcast: false, sign: false })
        .then(r => {
          // this.status.ledgerRequiresArbitrary = true
          this.handleSuccess(r)
        })
        .catch(e => {
          this.status.validated = false // transaction is invalid
          this.handleFailure(e)
        })
    }
  }
}
</script>

<style lang="stylus">

</style>
