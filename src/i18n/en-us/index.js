export default {
  lang: 'english',
  api: {
    main: 'EOS Mainnet APIs',
    telos: 'Telos Mainnet APIs',
    worbli: 'Worbli Mainnet APIs',
    bos: 'BOS Mainnet APIs',
    jungleTest: 'Jungle Testnet V2 APIs',
    kylinTest: 'CryptoKylin Testnet APIs',
    telosTest: 'Telos Testnet APIs'
  },
  welcome: {
    first: 'Welcome to <strong>My EOS Wallet</strong> (MEOW), a simple and secure web app to access and manage your EOS holdings using secure hardware wallets such as the Ledger Nano S and the Trezor (coming soon) hardware wallet!',
    second: 'This site will always be ad-free and 100% community supported. Our goal is to remain politically-neutral in the block-producer space and to sustain our hosting & development costs with the help of the community.'
  },
  homepage: {
    connect: 'Connect to EOS using ',
    accountViewer: 'Or use MEOW as an account viewer',
    publicKeys: 'Your public keys',
    link: '...is linked to the following accounts',
    notFound: 'no accounts found on this network with this key',
    search: 'Search by account name or public key'
  },
  notifications: {
    needChrome: 'Ledger support currently requires Google Chrome or Opera, some features won\'t work without it.',
    noLedger: 'Can\'t find your Ledger - Please restart the EOS app and try again',
    searchFailed: 'Account or public key not found',
    found: 'Found EOS account(s) at {0}',
    noAccountFound: 'No EOS account(s) found - Try changing your derivation path or switch to another network'
  },
  buttons: {
    patreon: 'Support MEOW on Patreon',
    donate: 'You can donate EOS to account meow.x to support this site',
    comingSoon: 'coming soon',
    needChrome: 'Requires Google Chrome or Opera'
  },
  txHistory: {
    receive: 'Receive Token',
    send: 'Send Token',
    contract: 'Contract',
    account: 'Account',
    resources: 'CPU / NET / RAM',
    producer: 'Producer',
    vote: 'Vote',
    other: 'Other',
    spam: 'Spam Filter'
  },
  voting: {
    voteMax: 'Vote for up to 30 block producers',
    voteForOne: 'Vote for {0}',
    voteMany: 'Vote for {0} block producers',
    findBP: 'Find Block Producers',
    useProxy: 'Use a voting proxy?',
    votingPower: 'Your voting power will diminish overtime so it\'s important to keep renewing your vote to maintain it\'s full power and to adjust your list of block producers based on their performance.'
  },
  eosAPI: {
    basic: 'Basic Actions',
    advanced: 'Advanced Actions',
    select: 'Select an Action',
    actions: {
      transfer: {
        label: 'Send {0} & Tokens',
        brief: 'Send {0} or any other tokens to another account'
      },
      newAccount: {
        label: 'Create Account',
        brief: 'Create a new account'
      },
      buyrambytes: {
        label: 'Buy RAM',
        brief: 'Purchase RAM for an account or smart-contract'
      },
      sellram: {
        label: 'Sell RAM',
        brief: 'Sell your existing RAM'
      },
      delegatebw: {
        label: 'Increase Stake',
        brief: 'Increase your staked amounts for CPU or Network resources'
      },
      undelegatebw: {
        label: 'Reduce Stake',
        brief: 'Reduce your staked amounts for CPU or Network resources'
      },
      voteproducer: {
        label: 'Vote',
        brief: 'Vote for up to 30 Block Producers'
      },
      pushtransaction: {
        label: 'Offline Transaction',
        brief: 'Send a transaction you signed offline'
      },
      refund: {
        label: 'Refund',
        brief: 'Fallback in case your unstaking funds don\'t return to you automatically'
      },
      updateauth: {
        label: 'Update Account Permissions',
        brief: 'Allows for changing of active/owner or other keys on your account'
      }
    }
  },
  account: {
    subtitle: 'Balance Breakdown',
    resources: {
      total: 'Total',
      availableEOS: 'Available {0}',
      availableRAM: 'Available RAM',
      availableNET: 'Available Network',
      availableCPU: 'Available CPU',
      available: 'Available',
      noAvailable: 'No {0} Available',
      netStake: 'Network Stake',
      unstakingNET: 'Unstaking Network',
      cpuStake: 'CPU Stake',
      unstakingCPU: 'Unstaking CPU',
      percentUsed: 'Used {0} of {1}' // ex: "Used 6.11 KB of 238.90 KB"
    },
    keys: 'Keys',
    airdrops: 'Airdrops'
  },
  tabs: {
    balance: 'balance',
    transactions: 'transactions',
    voting: 'voting',
    rawData: 'raw data'
  },
  stepper: {
    connectWallet: 'Connect wallet',
    selectDevice: 'Select your device',
    approve: 'Approve & Send',
    buttons: {
      cancel: 'cancel',
      continue: 'continue',
      createNew: 'create new transaction',
      validate: 'validate',
      viewTX: 'view on {0}'
    }
  },
  transactions: {
    success: 'Transaction Succeeded',
    failed: 'Transaction Failed',
    showDetails: 'Show Details',
    txId: 'transaction id: {0}' // ex: "transaction id: 111d9fafc8a4bf5405444c1777ff1cddf3a7b5fbd61f74f1e9c8da3a538171e6"
  },
  animations: {
    connectLedger: 'connect your ledger',
    connectTrezor: 'connect your trezor',
    waiting: 'waiting for approval',
    newTx: 'new transaction', // Max 20 characters
    approve: 'approve?' // Max 20 characters
  },
  raw: {
    signedTx: 'Signed Transaction',
    netResponse: 'Network Response',
    accountData: 'Account Data',
    txData: 'Transaction Data'
  },
  errors: {
    noAccount: 'Account doesn\'t exist',
    noToAccount: 'You didn\'t provide a valid "receiving" account in your transaction',
    expired: 'Your transaction has expired',
    fromInvalid: 'The account you\'re sending from does not match any known accounts, are you sure you own this account and it exists?',
    notYourAccount: 'The account you\'re sending from does not match the provided keys, are you sure you own this account?',
    noFunds: 'You don\'t have enough funds to complete this transaction',
    tooSmall: 'The quantity you\'re trying to purchase or sell is too small, trying increasing it',
    notRealToken: 'The token you\'re trying to send doesn\'t seem to exist, double check your spelling',
    notYourToken: 'You don\'t own any of the tokens you\'re trying to send',
    sentToSelf: 'You can\'t send EOS or tokens to yourself',
    apiDown: 'Your chosen API is down or blocking CORS, try another one',
    outOfCPU: 'Your transaction may have failed due to low staked CPU resources, wait 5-10min and check if it went through.',
    cantVoteYet: 'Your vote failed as you have not staked any EOS on this account yet.',
    duplicate: 'Your transaction failed because it is a duplicate of transaction id {0}',
    noRefund: 'Your transaction failed since no valid refund request was found.',
    needArbitraryMode: 'Ledger: You need to enable "Arbitrary Data" on your Ledger for this transaction - Warning Dangerous!',
    txRejected: 'Ledger: User rejected the transaction on the device',
    nonHardened: 'Ledger: The derivation path you specified is invalid, make sure it ends with a \'',
    timeout: 'Ledger: Your device timed out, you have about 30 seconds to approve a transaction before it fails',
    invalidData: 'Ledger: Your device is acting strangely, please restart it by removing and reconnecting the cable',
    unknownError: 'Unkown Error'
  }
}
