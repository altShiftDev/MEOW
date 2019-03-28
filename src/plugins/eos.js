import Eos from 'eosjs'

const eosConfig = {
  httpEndpoint: 'https://proxy.eosnode.tools',
  expireInSeconds: 3000,
  verbose: false,
  broadcast: false,
  sign: false
}
const allEndpoints = {
  eos: ['https://proxy.eosnode.tools', 'https://eos.greymass.com:443', 'https://eosapi.blockmatrix.network:443', 'https://node1.eosphere.io', 'https://user-api.eoseoul.io:443', 'https://api.eosn.io', 'https://api.main.alohaeos.com:443'],
  jungle: ['https://api.jungle.alohaeos.com'],
  telos: ['https://telos.greymass.com', 'https://telos.eosphere.io', 'https://api.eos.miami'],
  bos: ['https://bos.eosphere.io', 'https://hapi.bos.eosrio.io'],
  // telosTestnet: ['https://api.eos.miami:17441'],
  cryptokylin: ['https://api-kylin.eosasia.one', 'https://api-kylin.eoslaomao.com:443'],
  worbli: ['https://worbli.eosphere.io:443', 'https://endpoint-1.worbli.io']
}

function eos (api) {
  console.log('Mouting a new EOS Instance')
  eosConfig.httpEndpoint = api
  return Eos(eosConfig)
  // let response = await eos.getInfo({})
  // eosConfig.chainId = response.chain_id
}
async function mountEOS (eosInstance) {
  let response = await eosInstance.getInfo({})
  eosConfig.chainId = response.chain_id
}

export default ({ router, Vue }) => {
  router.beforeEach((to, from, next) => {
    console.log('from', from)
    console.log('to', to)
    let query = to.query
    // if (to.path === '/blog') {
    //   console.log('going to blog')
    //   return next()
    // }
    // let api = (query.api) ? query.api : 'https://proxy.eosnode.tools'
    let api = (query.api) ? query.api : undefined
    // let api
    let network = to.params.network
    if (to.meta[network]) {
      console.log('found meta id in destination', to.meta[network].id)
      if (query.api && allEndpoints[to.meta[network].id].includes(query.api)) {
        // console.log('api', api)
        // console.log('found api in url', allEndpoints[to.meta.id].includes(api))
      }
      else {
        api = allEndpoints[to.meta[network].id][0]
      } // && allEndpoints[to.meta.id].includes(query.api)
    }
    else {
      if (to.params.network || to.path === '/') {
        console.log('no meta')
        api = 'https://proxy.eosnode.tools'
      }
      else {
        return next()
      }
    }
    // if (to.query.api && from.query.api && to.query.api === from.query.api) {
    //   console.log('skipping EOS mount, same to same')
    //   next()
    //   return
    // }
    eosConfig.httpEndpoint = api
    Vue.prototype.$eos = eos(api)
    mountEOS(Vue.prototype.$eos)
    next()
  })
}
