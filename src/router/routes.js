const ledgerAppVersion = '1.2.0'
const meta = {
  eos: {
    id: 'eos',
    chain: 'EOS',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    symbol: 'EOS',
    blockExplorer: 'https://www.bloks.io/transaction/',
    hasValue: true,
    precision: 4
  },
  worbli: {
    id: 'worbli',
    chain: 'Worbli',
    chainId: '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f',
    symbol: 'WBI',
    blockExplorer: 'https://www.worbli.bloks.io/transaction/',
    hasValue: false,
    precision: 4
  },
  bos: {
    id: 'bos',
    chain: 'BOS',
    chainId: '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f',
    symbol: 'BOS',
    blockExplorer: 'https://bos.eosx.io/tx/',
    hasValue: false,
    precision: 4
  },
  jungle: {
    id: 'jungle',
    chain: 'Jungle Testnet v2',
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    symbol: 'EOS',
    blockExplorer: 'https://monitor.jungletestnet.io/#tx:',
    hasValue: false,
    precision: 4
  },
  cryptokylin: {
    id: 'cryptokylin',
    chain: 'CryptoKylin Testnet',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    symbol: 'EOS',
    blockExplorer: 'https://tools.cryptokylin.io/#/tx/',
    hasValue: false,
    precision: 4
  },
  telos: {
    id: 'telos',
    chain: 'Telos',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    symbol: 'TLOS',
    blockExplorer: 'https://telos.eosx.io/tx/',
    hasValue: false,
    precision: 4
  },
  telosTestnet: {
    id: 'telosTestnet',
    chain: 'Telos Testnet',
    chainId: 'e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3',
    symbol: 'TLOS',
    blockExplorer: 'http://testnet.telosfoundation.net/transaction/',
    hasValue: false,
    precision: 4
  },
  ledgerAppVersion: ledgerAppVersion
}
// const regex = new RegExp(/^(?!(blog)\W).*/)
// const regex = new RegExp(/^([^.]+\.)*blog/g)
// ^(?!blog)\S*?\w*
// /^([^.]+\.)*blog/g
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '/blog', name: 'My EOS Blog | MEOW', component: () => import('pages/blog') },
      { path: '/:network?', name: 'MEOW Homepage', component: () => import('pages/homepage'), meta: meta },
      // { path: '/gettingStarted', name: 'Getting Started with your Ledger | MEOW', component: () => import('pages/gettingStarted') },
      {
        path: '/account/:accountName/:dPath?', // keeps backwards compatibility with older bookmarks
        name: 'EOS Mainnet',
        component: () => import('pages/account'),
        meta: meta,
        beforeEnter: (to, from, next) => {
          console.log('to test', to)
          next({ path: `eos/account/${to.params.accountName}/`, params: to.params })
        }
      },
      {
        path: '/:network/:accountOrAPI/:accountName/:dPath?/:authority?/:contract?/',
        name: 'Account',
        component: () => import('pages/account'),
        meta: meta
      },
      { path: '/:network/authenticate', name: 'Authenticate', component: () => import('pages/authenticate'), meta: meta }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
