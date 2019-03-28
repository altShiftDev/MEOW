<template>

  <div class="row col-12 justify-between q-pa-lg bg-white" style="position: relative;">

    <div class="row col-12 justify-center">

      <q-btn v-for="(x, index) in filters" :key="index" @click="filter === index ? filter = '' : filter = index" :label="x.label" class="col-auto q-mr-xs q-mb-sm" :color="x.color" no-caps :outline="!(filter === index)"/>

      <q-toggle v-model="spamFilter.isActive" checked-icon="check" class="col-auto q-pl-md" :label="spamFilter.label" />
      <span v-if="filteredHistory.length === 0" class="q-mt-xl col-12 text-center">No transactions found, try changing your filters</span>
    </div>

    <q-timeline responsive color="grey" class="col-12">

      <q-timeline-entry v-if="filteredHistory.length > 0" v-for="(x, index) in filteredHistory" :key="index"
        :title="getTitle(x.action_trace.act.name, x.action_trace.act.data.to)"
        :subtitle="formatDate(x.block_time)"
        :side="(index % 2 === 0) ? 'left' : 'right'"
      >
        <div>
          <template v-if="x.action_trace.act.name === 'post'">
            <p class="ellipsis" v-for="(x, index) in x.action_trace.act.data" :key="index">{{ index }}: {{ x }}</p>
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'claimrewards'">
            {{ x.action_trace.act.data.name }} claimed their block producer reward
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'claim'">
            <p v-for="(y, index) in x.action_trace.act.data" :key="index">{{ index }}: {{ y }}</p>
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'voteproducer' || x.action_trace.act.name === 'vote'">

            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.voter }}</q-chip>
            <template v-if="x.action_trace.act.data.proxy !== '' && x.action_trace.act.name === 'voteproducer'">
               proxied their vote to {{ x.action_trace.act.data.proxy }}
            </template>

            <template v-else-if="x.action_trace.act.data.proposal_name !== '' && x.action_trace.act.name === 'vote'">
              voted
              <span class="text-negative" v-if="x.action_trace.act.data.vote === 0"> against </span>
              <span class="text-positive" v-else-if="x.action_trace.act.data.vote === 1"> for</span>
              <span class="text-grey-7" v-else-if="x.action_trace.act.data.vote === 2 || x.action_trace.act.data.vote === 3"> to abstain on </span>
              <span v-else> on </span>
              proposal <strong>{{ x.action_trace.act.data.proposal_name }}</strong>

              <span v-if="parseComments(x.action_trace.act.data.vote_json)">
                with comment:
                <i class="block">{{ parseComments(x.action_trace.act.data.vote_json) }}</i>
              </span>
            </template>

            <template v-else>
              voted for:
              <span v-for="(x, index) in x.action_trace.act.data.producers" :key="index">
                <q-chip small dense>{{ x }}</q-chip>
              </span>
            </template>

            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'status'">
            {{ x.action_trace.act.account }}: {{ x.action_trace.act.data.content }}
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'propose'">
            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.proposer || x.action_trace.act.account }}</q-chip>
             proposed

            <span v-if="x.action_trace.act.data.title || x.action_trace.act.data.proposal_name">{{ x.action_trace.act.data.title || x.action_trace.act.data.proposal_name }}</span>

            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'approve'">
            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.level.actor || x.action_trace.act.account }}</q-chip>
            approved the {{ x.action_trace.act.data.proposal_name }} proposal by {{ x.action_trace.act.data.proposer }}
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'set'">
            {{ x.action_trace.act.data.owner }} disclosed their organization info: <span @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)" class="link" :href="$route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id">{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5) }}</span>
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'transfer' && x.action_trace.act.data.to === 'eosio.stake'">
            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.from }}</q-chip> staked
            {{ x.action_trace.act.data.quantity }}
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'delegatebw'">
            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.from }}</q-chip> staked
            {{ x.action_trace.act.data.stake_cpu_quantity }} to <span class="text-weight-medium">CPU</span> and {{ x.action_trace.act.data.stake_net_quantity }} to <span class="text-weight-medium">Network</span>
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'undelegatebw'">
            <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.from }}</q-chip> unstaked
            {{ x.action_trace.act.data.unstake_cpu_quantity }} from <span class="text-weight-medium">CPU</span> and {{ x.action_trace.act.data.unstake_net_quantity }} from <span class="text-weight-medium">Network</span>
            <br>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'arbitration' && x.action_trace.act.account === 'ecafofficiel'">
            <q-chip color="negative" square pointing="right">Scam Warning</q-chip>
            This transaction is pretending to be from ECAF.
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>

          <template v-else-if="x.action_trace.act.name === 'transfer'">
            <div>
              <div v-if="typeof x.action_trace.act.data !== 'string'">
                <div class="q-pb-xs" v-if="x.action_trace.act.data.from === 'telos.x' || x.action_trace.act.data.from === 'ecafofficiel'">
                  <q-chip color="negative" square pointing="right">Scam Warning</q-chip>
                  <span v-if="x.action_trace.act.data.from === 'telos.x'">This transaction is pretending to be from the Telos Foundation.</span>
                  <span v-if="x.action_trace.act.data.from === 'ecafofficiel'">This transaction is pretending to be from ECAF.</span>
                </div>

                <q-chip color="primary" square pointing="right">{{ x.action_trace.act.data.from }}</q-chip>
                <q-chip color="teal-4" square>{{ x.action_trace.act.data.to }}</q-chip>
                <q-chip color="amber-5" square>{{ x.action_trace.act.data.quantity }}</q-chip>  <br>
              </div>

              <span v-else class="ellipsis-">{{ x.action_trace.act.data }}</span>

              <template v-if="x.action_trace.act.data.memo">
                <span class="q-caption">Memo: {{ x.action_trace.act.data.memo }}</span>
                <q-tooltip>
                  {{ x.action_trace.act.data.memo }}
                </q-tooltip>
              </template>

              <br>
              <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
            </div>
          </template>

          <template v-else-if="x.action_trace.act.data.from !== '' && x.action_trace.act.data.memo !== '' && x.action_trace.act.data.to !== '' && x.action_trace.act.data.quantity === undefined">
            <div>
              <template v-if="typeof x.action_trace.act.data !== 'string'">
                <q-chip color="primary" square pointing="right">{{ x.action_trace.act.account || x.action_trace.act.data.from }}</q-chip>
                <q-chip color="teal-4" square>{{ x.action_trace.act.data.to || x.action_trace.act.data.recipient || accountName }}</q-chip>
                <br>
              </template>

              <template v-if="x.action_trace.act.data.memo">
                <span class="q-caption">Memo: {{ x.action_trace.act.data.memo }}</span>
                <q-tooltip>
                  {{ x.action_trace.act.data.memo }}
                </q-tooltip>
              </template>

              <template v-if="x.action_trace.act.data.message">
                <span class="q-caption">Message: {{ x.action_trace.act.data.message }}</span>
                <q-tooltip>
                  {{ x.action_trace.act.data.message }}
                </q-tooltip>
              </template>

              <br>
              <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
            </div>
          </template>

          <template v-else>
            <q-btn dense outline icon="link" class="q-my-xs" @click="openURL($route.meta[$route.params.network].blockExplorer + x.action_trace.trx_id)">TX ...{{ x.action_trace.trx_id.substr(x.action_trace.trx_id.length - 5)}}</q-btn>
          </template>
        </div>
      </q-timeline-entry>

    </q-timeline>

  </div>
</template>

<script>
import { openURL, date } from 'quasar'
export default {
  name: 'accountHistory',
  props: ['accountName', 'historyData'],
  data () {
    return {
      loading: false,
      filter: '',
      hideSmallBalances: true,
      filters: {
        received: {
          label: 'Receive Token',
          isActive: false,
          color: 'pink',
          names: ['receivetoken', 'transfer']
        },
        sent: {
          label: 'Send Token',
          isActive: false,
          color: 'purple',
          names: ['sendtoken', 'transfer']
        },
        resources: {
          label: 'CPU / NET / RAM',
          isActive: false,
          color: 'secondary',
          names: ['delegatebw', 'undelegatebw', 'buyrambytes', 'sellrambytes', 'sellram', 'buyram']
        },
        vote: {
          label: 'Vote',
          isActive: false,
          color: 'amber-9',
          names: ['voteproducer', 'vote']
        },
        contract: {
          label: 'Contract',
          isActive: false,
          color: 'blue',
          names: ['riddleriddle', 'spaceinvader', 'resolvebet', 'betreceipt', 'issue', 'claim', 'paytxfee', 'brainmeiq']
        },
        account: {
          label: 'Account',
          isActive: false,
          color: 'deep-purple',
          names: ['newaccount', 'approve', 'propose', 'linkauth', 'updateauth']
        },
        producer: {
          label: 'Producer',
          isActive: false,
          color: 'brown',
          names: ['claimrewards', 'regproducer', 'unregprod']
        },
        other: {
          label: 'other',
          isActive: false,
          color: 'black',
          names: []
        }
      },
      spamFilter: {
        label: 'Spam Filter',
        isActive: true,
        color: 'green',
        names: ['broadcast', 'promote', 'sendmessage', 'tip', 'issuefrost', 'hi', 'yell', 'news', 'news1113', 'topnews', 'msg', 'u', 'n', 'i', 'push']
      }
    }
  },
  computed: {
    filteredHistory () {
      let filter = this.filter
      let arr = this.spamFilter.isActive ? this.historyData.filter(x => {
        if (x.action_trace.act.name === 'transfer' && x.action_trace.act.data.quantity !== undefined && x.action_trace.act.data.quantity.startsWith('0.00')) {
          return false
        }
        if (this.spamFilter.names.includes(x.action_trace.act.name)) {
          return false
        }
        else {
          return true
        }
      })
        : this.historyData

      if (filter === 'received') {
        arr = arr.filter(x => x.action_trace.act.data.to === this.accountName)
      }

      else if (filter === 'sent') {
        arr = arr.filter(x => x.action_trace.act.data.from === this.accountName)
      }

      else if (filter === 'contract') {
        arr = arr.filter(x => this.filters.contract.names.includes(x.action_trace.act.name))
      }

      else if (filter === 'account') {
        arr = arr.filter(x => this.filters.account.names.includes(x.action_trace.act.name))
      }

      else if (filter === 'resources') {
        arr = arr.filter(x => {
          if (x.action_trace.act.name === 'transfer' && x.action_trace.act.account === 'eosio.token' && x.action_trace.act.data && x.action_trace.act.data.to === 'eosio.stake') {
            return true
          }
          else {
            return this.filters.resources.names.includes(x.action_trace.act.name)
          }
        })
      }

      else if (filter === 'producer') {
        arr = arr.filter(x => this.filters.producer.names.includes(x.action_trace.act.name))
      }

      else if (filter === 'vote') {
        arr = arr.filter(x => this.filters.vote.names.includes(x.action_trace.act.name))
      }

      else if (filter === 'other') {
        var other = []
        for (var x in this.filters) {
          other = [...other, ...this.filters[x].names]
        }
        // console.log('other arr', other)
        arr = arr.filter(x => !(other.includes(x.action_trace.act.name)))
      }
      console.log('clean array', arr)
      return arr
    }
  },
  methods: {
    openURL,
    getTitle (x, to) {
      if (x === 'transfer') {
        return to === 'eosio.stake' ? 'stake' : 'token transfer'
      }
      if (x === 'voteproducer') {
        return 'producer voting'
      }
      if (x === 'vote') {
        return 'proposal voting'
      }
      if (x === 'claim') {
        return 'claim'
      }
      if (x === 'post') {
        return 'post'
      }
      if (x === 'claimrewards') {
        return 'claimrewards'
      }
      if (x === 'voteproducer') {
        return 'voteproducer'
      }
      if (x === 'status') {
        return 'status'
      }
      if (x === 'propose') {
        return 'propose'
      }
      if (x === 'approve') {
        return 'approve'
      }
      if (x === 'set') {
        return 'set'
      }
      if (x === 'delegatebw') {
        return 'stake'
      }
      if (x === 'undelegatebw') {
        return 'unstake'
      }
      if (x === 'updateauth') {
        return 'updateauth'
      }
      else {
        return 'message / other'
      }
    },
    formatDate (timestamp) {
      timestamp = timestamp + 'Z'
      let formatted = date.formatDate(timestamp, 'ddd MMM Do YYYY h:mm:ss A')
      return formatted
    },
    parseComments (json) {
      // console.log('json', json)
      try {
        json = JSON.parse(json)
        // console.log('parse', json)
        if (json.comment && json.comment !== '') {
          return json.comment
        }
      }
      catch (e) {
        // console.log('e', e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.q-card-subtitle
  text-align right

span.link, p.link
  color: -webkit-link;
  cursor: pointer;
  text-decoration: underline;
</style>
