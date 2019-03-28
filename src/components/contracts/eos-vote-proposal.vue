<template>
  <div class="col-12">
    <div id="meow-contract-helper" class="scroll row col-12 justify-around items-center text-center bg-black relative-position" :estimate="updateEstimate">

      <div v-if="!status.signRequested" class="col-12 row items-center justify-center q-pa-sm">
        <div class="col-12 row">
          <span class="col-12">Current Voting Power</span>
        </div>
        <q-knob readonly class="col-auto q-my-xs"
          v-model="currentUsage"
          size="50px"
          style="font-size: 1.1rem"
          color="secondary"
          track-color="transparent"
          line-width="3px"
          :min="0"
          :max="projectedUsage"
        >
          <span class="text-white text-weight-bold">{{(currentUsage / projectedUsage * 100).toFixed(0) }}%</span>
        </q-knob>
        <span class="col-12 text-grey">Increase your stake to increase your voting power</span>
      </div>
      <div v-else>
        <div class="row col-12 justify-center">
          <div class="col-auto text-left">
            <div>
              <q-spinner-oval v-if="status.validated === undefined && status.loading"/>
              <q-icon v-else-if="status.validated" name="done" color="secondary"></q-icon>
              <q-icon v-else name="error" color="negative"></q-icon>
              <span class="on-right">Transaction Validated</span>
            </div>
            <div>
              <q-spinner-oval v-if="status.walletFound === undefined && status.loading"/>
              <q-icon v-else-if="status.walletFound" name="done" color="secondary"></q-icon>
              <q-icon v-else name="error" color="negative"></q-icon>
              <span class="on-right">Ledger Found</span>
            </div>
            <div v-if="status.ledgerRequiresArbitrary">
              <q-spinner-oval v-if="ledger.arbitraryEnabled === undefined && status.loading"/>
              <q-icon v-else-if="ledger.arbitraryEnabled" name="done" color="secondary"></q-icon>
              <q-icon v-else name="error" color="negative"></q-icon>
              <span class="on-right">Arbitrary Data Mode Enabled</span>
            </div>
            <div>
              <q-spinner-oval v-if="status.txSigned === undefined && status.loading"/>
              <q-icon v-else-if="status.txSigned" name="done" color="secondary"></q-icon>
              <q-icon v-else name="error" color="negative"></q-icon>
              <span class="on-right">Transaction Signed</span>
            </div>
            <div>
              <q-spinner-oval v-if="status.txSent === undefined && status.loading"/>
              <q-icon v-else-if="status.txSent" name="done" color="secondary"></q-icon>
              <q-icon v-else name="error" color="negative"></q-icon>
              <span class="on-right">Pushed to Network</span>
            </div>
          </div>
          <span v-if="status.message" class="text-center col-12 q-px-sm">{{ status.message }}</span>
        </div>
      </div>
    </div>

    <!-- contract text -->
    <div class="row items-center q-px-md">
      <span class="col-auto">I'm voting</span>

      <q-select dark
        class="q-mx-sm"
        no-icon
        no-parent-field
        color="secondary"
        v-model="voteproposal.fields.vote.default"
        radio
        :options="voteproposal.fields.vote.options"
      />
      <span
        class="col-auto q-px-xs"
      >
        proposal
      </span>

      <span
        class="col-auto text-weight-bold q-px-xs"
      >
        {{ voteproposal.fields.proposal_name.default }}
      </span>

      <span
        class="col-auto q-px-xs"
      >
        with comment
      </span>

      <span

        class="col-auto"
      >
        <q-input dark
          class="col-auto"
          color="secondary"
          v-model.trim="voteproposal.fields.comment.default"
          :style="{ width: maxWidth(voteproposal.fields.comment.default, voteproposal.fields.comment.error, '.', voteproposal.fields.comment.placeholder) + 'px' }"
          :placeholder="voteproposal.fields.comment.placeholder"
          style="maxWidth: 500px"
          :error="voteproposal.fields.comment.error"
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
export default {
  name: 'RAM',
  components: {
  },
  props: ['accountData', 'resources', 'maxWidth', 'handleSuccess', 'handleFailure', 'status', 'ledger'],
  data () {
    return {
      // status: 'Searching for Ledger',
      currentUsage: (this.resources.cpuTotal + this.resources.netTotal),
      projectedUsage: (this.resources.cpuTotal + this.resources.netTotal + this.resources.liquid),
      subtitle: `Vote for EOS Proposals`,
      voteproposal: {
        icon: 'attach_money',
        fields: {
          voter: {
            label: 'Voter',
            default: this.$route.params.accountName,
            placeholder: '',
            error: false,
            helper: ''
          },
          proposal_name: {
            label: 'Proposal Name',
            default: this.$route.query.proposalName,
            placeholder: '',
            error: false,
            helper: ''
          },
          vote: {
            label: 'Vote',
            default: Number(this.$route.query.vote) || 1,
            options: [
              {
                label: 'against',
                value: 0
              },
              {
                label: 'for',
                value: 1
              },
              {
                label: 'to abstain on',
                value: 2
              }
            ],
            placeholder: '',
            error: false,
            helper: ''
          },
          comment: {
            label: 'Comment',
            default: this.$route.query.comment || '',
            placeholder: '(optional comment)',
            error: false,
            helper: '',
            icon: 'add_comment'
          }
        }
      }
    }
  },
  computed: {
    updateEstimate () {
      let amount = this.resources.netTotal + this.resources.cpuTotal
      // console.log(this.currentUsage, this.projectedUsage)
      let projected = `Your voting power is ${(this.currentUsage / this.projectedUsage * 100).toFixed(0)}% or ${this.currentUsage.toFixed(4)} EOS`
      let err = `You don't have any staked EOS, you must stake some EOS before you can vote'`
      let estimate = (amount === null) ? `${err}` : `${projected}`
      this.usageHelper()
      this.$emit('updateEstimate', estimate)
      return estimate
    }
  },
  beforeMount () {
    this.$emit('updateSubtitle', this.subtitle)
  },
  mounted () {
    this.usageHelper()
    console.log('resources', this.resources)
  },
  methods: {
    usageHelper () {
      let currentUsage = this.resources.cpuTotal + this.resources.netTotal
      this.currentUsage = Number(currentUsage)
      let projectedUsage = this.resources.cpuTotal + this.resources.netTotal + this.resources.liquid
      this.projectedUsage = Number(projectedUsage)
    },
    generatePayload () {
      let comments = this.voteproposal.fields.comment.default !== '' ? { comment: `${this.voteproposal.fields.comment.default}` } : {}
      let p = {
        voter: this.voteproposal.fields.voter.default,
        proposal_name: this.voteproposal.fields.proposal_name.default,
        vote: Number(this.voteproposal.fields.vote.default),
        vote_json: JSON.stringify(comments)
      }
      console.log('payload', p)
      this.$eos.transaction({
        actions: [
          {
            account: 'eosio.forum',
            name: 'vote',
            authorization: [{
              actor: this.$route.params.accountName,
              permission: this.$route.params.authority ? this.$route.params.authority.toLowerCase() : 'active'
            }],
            data: p
          }
        ]
      }, { broadcast: false, sign: false })
        .then(r => {
          this.status.ledgerRequiresArbitrary = true
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
