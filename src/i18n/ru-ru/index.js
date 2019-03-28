export default {
  lang: 'русский',
  api: {
    main: 'EOS API Сервисы',
    telos: 'Telos API Сервисы',
    worbli: 'Worbli API Сервисы',
    bos: 'BOS API Сервисы',
    jungleTest: 'API Jungle Сервисы Тестовой сети',
    kylinTest: 'API CryptoKylin Сервисы Тестовой сети',
    telosTest: 'API Telos Сервисы Тестовой сети'
  },
  welcome: {
    first: 'Добро пожаловать в <strong>My EOS Wallet</strong> (MEOW) - простое и безопасное веб-приложение для доступа и управления вашими фондами EOS посредством таких безопасных кошельков как Ledger Nano S и Trezor (в ближайшем будущем)!',
    second: 'На этом сайте вы никогда не увидите рекламу, он на 100% существует за счет поддержки сообщества. Наша цель - оставаться политически нейтральной площадкой в сфере блок-продюсеров и продолжать хостинг и дальнейшие разработки при поддержке сообщества EOS.'
  },
  homepage: {
    connect: 'Подключить EOS с помощью ',
    accountViewer: 'Или просмотреть счет в MEOW',
    publicKeys: 'Your public keys',
    link: '...is linked to the following accounts',
    notFound: 'no accounts found on this network with this key',
    search: 'Искать по наименованию счета или по открытому ключу'
  },
  notifications: {
    needChrome: 'Ledger support currently requires Google Chrome or Opera, some features won\'t work without it.',
    noLedger: 'Can\'t find your Ledger - Please restart the EOS app and try again',
    searchFailed: 'Account or public key not found',
    found: 'Found EOS account(s) at {0}',
    noAccountFound: 'No EOS account(s) found - Try changing your derivation path or switch to another network'
  },
  buttons: {
    patreon: 'Поддержать MEOW на Patreon',
    donate: 'Donate EOS to meow.x',
    comingSoon: 'Скоро',
    needChrome: 'Requires Google Chrome or Opera'
  },
  txHistory: {
    receive: 'Получен токен',
    send: 'Отправлен токен',
    contract: 'Контракт',
    account: 'Счет',
    resources: 'CPU / NET / RAM',
    producer: 'Производитель',
    vote: 'Голосование',
    other: 'другое',
    spam: 'Фильтр спама'
  },
  voting: {
    voteMax: 'Проголосовать за макс 30 производителей блоков',
    voteForOne: 'Проголосовать за {0}',
    voteMany: 'Проголосовать за {0} Производители блоков',
    findBP: 'Найти производителей блоков',
    useProxy: 'Использовать прокси для голосования?',
    votingPower: 'Постепенно сила ваших голосов будет уменьшаться, поэтому важно обновлять ваш голос для поддержания его полной силы, а также регулировать ваш список производителей блоков на основе их активности.'
  },
  eosAPI: {
    basic: 'Основные операции',
    advanced: 'Дополнительные операции',
    select: 'Выберите одну из опций',
    actions: {
      transfer: {
        label: 'Отправить {0}',
        brief: 'Отправить EOS или иной токен на другой счет'
      },
      newAccount: {
        label: 'Создать счет',
        brief: 'Создать новый счет'
      },
      buyrambytes: {
        label: 'Купить RAM',
        brief: 'Купить оперативную память (RAM) для счета или смарт-контракта'
      },
      sellram: {
        label: 'Продать RAM',
        brief: 'Продать оперативную память (RAM)'
      },
      delegatebw: {
        label: 'Зарезервировать больше ресурсов',
        brief: 'Увеличить объем зарезервированных процессорных мощностей (CPU) или пропускной способности (Network resources)'
      },
      undelegatebw: {
        label: 'Сократить зарезервированные ресурсы',
        brief: 'Сократить объем зарезервированных процессорных мощностей (CPU) или пропускной способности (Network resources)'
      },
      voteproducer: {
        label: 'Проголосовать',
        brief: 'Проголосовать за производителей блоков (до 30 производителей)'
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
    subtitle: 'Разбивка Баланса',
    resources: {
      total: 'Все Средства',
      availableEOS: 'Доступные {0}',
      availableRAM: 'Доступная RAM',
      availableNET: 'Доступная Network',
      availableCPU: 'Доступные CPU',
      available: 'Доступные средства',
      noAvailable: 'Нет доступных {0}',
      netStake: 'Зарезервированная Network',
      unstakingNET: 'Разрезервируемая Network',
      cpuStake: 'Зарезервированные CPU',
      unstakingCPU: 'Разрезервируемые CPU',
      percentUsed: 'Использовано {0} из {1}' // ex: "Used 6.11 KB of 238.90 KB"
    },
    keys: 'ключи',
    airdrops: 'эйрдропы'
  },
  tabs: {
    balance: 'Баланс',
    transactions: 'транзакции',
    voting: 'voting',
    rawData: 'исходные данные'
  },
  stepper: {
    connectWallet: 'Подключить кошелек',
    selectDevice: 'Выбрать устройство',
    approve: 'Одобрить и оправить',
    buttons: {
      cancel: 'отменить',
      continue: 'продолжить',
      createNew: 'новая транзакция',
      validate: 'подтвердить',
      viewTX: 'просмотреть на bloks.io' // view on bloks.io
    }
  },
  transactions: {
    success: 'Transaction Succeeded',
    failed: 'Transaction Failed',
    showDetails: 'Show Details',
    txId: 'transaction id: {0}' // ex: "transaction id: 111d9fafc8a4bf5405444c1777ff1cddf3a7b5fbd61f74f1e9c8da3a538171e6"
  },
  animations: {
    connectLedger: 'подключите Леджер',
    connectTrezor: 'подключите Трезор',
    waiting: 'ожидание подтверждения',
    newTx: 'новая транзакция', // Max 20 characters
    approve: 'подтвердить?' // Max 20 characters
  },
  raw: {
    signedTx: 'Подписанная транзакция',
    netResponse: 'Реакция сети',
    accountData: 'Данные счета',
    txData: 'Данные транзакций'
  },
  errors: {
    noAccount: 'Счет не существует',
    noToAccount: 'В транзакции указан недействительный счет «получателя»',
    expired: 'Истек срок действия транзакции',
    fromInvalid: 'Счет отправления не соответствует существующему счету, вы уверены, что этот счет существует и принадлежит вам?',
    notYourAccount: 'Счет отправления не соответствует предоставленным ключам, вы уверены, что этот счет принадлежит вам?',
    noFunds: 'Недостаточно средств для осуществления транзакции',
    tooSmall: 'The quantity you\'re trying to purchase is too small, trying increasing it',
    notRealToken: 'Токен, который вы пытаетесь отправить, не существует, проверьте написание',
    notYourToken: 'Токен, который вы пытаетесь отправить, не найден на данном счете',
    sentToSelf: 'Невозможно отправить EOS и токены самому себе',
    apiDown: 'Выбранный API выключен или блокирует CORS, попробуйте другой',
    outOfCPU: 'Your transaction may have failed due to low staked CPU resources, wait 5-10min and check if it went through.',
    cantVoteYet: 'Your vote failed as you have not staked any EOS on this account yet.',
    duplicate: 'Your transaction failed because it is a duplicate of transaction id {0}',
    noRefund: 'Your transaction failed since no valid refund request was found.',
    needArbitraryMode: 'Необходимо включить «Arbitrary Data» на вашем устройстве для этого типа транзакций - чрезвычайно опасно',
    txRejected: 'Пользователь отклонил транзакцию на устройстве',
    nonHardened: 'Указанный путь вывода недействителен, убедитесь, что он заканчивается символом \'',
    timeout: 'Ledger: Your device timed out, you have about 30seconds to approve a transaction before it fails',
    invalidData: 'Ledger: Your device is acting strangely, please restart it by removing and reconnecting the cable',
    unknownError: 'Неизвестная ошибка'
  }
}
