<template>
  <div class="row col-12 bg-white" style="position: relative;">
    <q-table
      class="col-12"
      color="primary"
      selection="multiple"
      row-key="owner"
      :loading="loading"
      :filter="filter"
      :data="tableData"
      :columns="columns"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :rowsPerPageOptions="rowsPerPageOptions"
    >
      <template slot="top-right" slot-scope="props">
        <q-search inverted color="white" class="text-black" placeholder="Search Block Producers" hide-underline v-model="filter" clearable/>
      </template>

      <template slot="top-left" slot-scope="props">
        <div class="row full-width" style="height: 36px">
          <span v-if="selected.length === 0" class="q-subtitle q-ma-sm">
            Vote for up to 30 block producers
          </span>
          <template v-else>
            <q-btn v-if="selected.length === 1" color="deep-purple" class="q-mx-sm col-auto" :label="'Vote for ' + selected[0].owner" @click="$emit('vote', selected)"/>
            <q-btn v-else-if="selected.length > 1 && selected.length <= 30" color="deep-purple" class="q-mx-sm col-auto" :label="'Vote for ' + selected.length + ' block producers'" @click="$emit('vote', selected)"/>
            <q-btn v-else color="amber" class="q-mx-sm col-auto" label="You can only vote for 30 producers"/>
          </template>
        </div>
      </template>

      <q-tr slot="top-row" slot-scope="props">
        <q-td colspan="100%">
          <strong>Looking for Referendums & Polls?</strong> Go to <a href="https://eosauthority.com/polls?lnc=en" target="_blank">EOS Authority's Polls Page</a> and choose <i class="capitalize text-weight-light">Vote with MEOW</i>
        </q-td>
      </q-tr>

      <q-td slot="body-cell-url" slot-scope="props" :props="props">
        <a :href="props.value" target="_blank">{{ props.value.replace(/^https?:\/\//, '') }}</a>
      </q-td>

      <q-td slot="body-cell-owner" slot-scope="props" :props="props">
        <template v-if="siteSupporters.includes(props.value)">
          <q-chip detail square small icon="star" color="deep-purple">{{ props.value }}</q-chip>
          <q-tooltip>This Block Producer is financially supporting My EOS Wallet, please consider voting for them.</q-tooltip>
        </template>
        <template v-else>
          {{ props.value }}
        </template>
      </q-td>

      <q-td slot="body-cell-status" slot-scope="props" :props="props">
        <q-chip small square :color="props.value ? 'primary' : 'orange'">{{ props.value ? 'top 21' : 'standby' }}</q-chip>
      </q-td>
    </q-table>

  </div>
</template>

<script>
var NumAbbr = require('number-abbreviate')
const numAbbr = new NumAbbr()

export default {
  name: 'accountVoting',
  props: ['accountData', 'bpList', 'totalWeight'],
  data () {
    return {
      sortMethod: 'rank',
      sortOptions: [
        { label: 'alphabetical order', value: 'alpha' },
        { label: 'by rank', value: 'rank' }
      ],
      selected: [],
      filter: '',
      loading: false,
      siteSupporters: ['blockmatrix1', 'eosphereiobp', 'eos42freedom', 'bosphereiobp'],
      rowsPerPageOptions: [10, 25, 50, 0],
      pagination: {
        page: 1,
        rowsPerPage: 25,
        sortBy: null,
        descending: false
      },
      columns: [
        { name: 'owner', label: 'Name', field: 'owner', align: 'left', sortable: true },
        { name: 'url', label: 'Site', field: 'url', align: 'left', sortable: false },
        { name: 'votes', label: 'Votes', field: 'votes', align: 'left', sortable: true },
        { name: 'percent', label: 'Percentage', field: 'percent', align: 'left', sortable: true },
        { name: 'status',
          label: 'Status',
          field: '__index',
          align: 'left',
          sortable: false,
          format: x => {
            return !(x > 20)
          }
        }
      ]
    }
  },
  beforeMount () {
    this.loading = true
  },
  mounted () {
    if (this.accountData.voter_info) {
      this.selected = this.accountData.voter_info.producers.map(v => ({ __index: 0, owner: v }))
    }
  },
  computed: {
    tableData () {
      let data = this.bpList.map(v => ({
        owner: v.owner,
        votes: numAbbr.abbreviate((v.total_votes / this.calcVoteWeight() / 10000), 2),
        percent: `${(v.total_votes / this.totalWeight * 100).toFixed(2)}%`,
        url: v.url
      }))
      this.loading = false
      return data
    }
  },
  methods: {
    calcVoteWeight () {
      let timestamp = 946684800000
      let dates = (Date.now() / 1000) - (timestamp / 1000)
      let weight = Math.floor(dates / (86400 * 7)) / 52 // 86400 = seconds per day 24*3600
      return Math.pow(2, weight)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
