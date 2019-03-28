/********************************************************************************
 *   altShiftDev's Ledger JS API
 *   (c) 2018 altShiftDev.com
 *
 ********************************************************************************/

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck')

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2)

var _createClass2 = require('babel-runtime/helpers/createClass')

var _createClass3 = _interopRequireDefault(_createClass2)

var _promise = require('babel-runtime/core-js/promise')

var _promise2 = _interopRequireDefault(_promise)

// var _sha = require('sha.js')

const fcbuffer = require('fcbuffer')
const assert = require('assert')
const asn1 = require('asn1-ber')
const bippath = require('bip32-path')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var INS_GET_PK = 0x02
var INS_GET_CONF = 0x06

var SW_OK = 0x9000

/**
Variables needed for signing a transaction hash, currently a disabled feature
  var INS_SIGN_TX_HASH = 0x08
  var INS_KEEP_ALIVE = 0x10
  var SW_CANCEL = 0x6985
  var SW_NOT_ALLOWED = 0x6c66
  var SW_UNSUPPORTED = 0x6d00
  var TX_MAX_SIZE = 1540
*/

var SW_KEEP_ALIVE = 0x6e02

const CLA = 0xD4
const INS_SIGN = 0x04
const P1_FIRST = 0x00
const P1_MORE = 0x80

/**
 * EosLedger API
 *
 * @example
 * import TransportU2F from '@ledgerhq/hw-transport-u2f'
 * import LedgerEos from 'assets/EosLedger.js'
 * async function ledgerAPI () {
 *  const transport = await TransportU2F.create()
 *  return new LedgerEos(transport)
 * }
 */

var EosLedger = (function () {
  function EosLedger (transport) {
    (0, _classCallCheck3.default)(this, EosLedger)

    this.transport = transport
    transport.decorateAppAPIMethods(this, ['getAppConfiguration', 'getPublicKey', 'signTransaction', 'signHash', 'serialize'], 'e0s')
  }

  (0, _createClass3.default)(EosLedger, [{
    key: 'getAppConfiguration',
    value: function getAppConfiguration () {
      return this.transport.send(CLA, INS_GET_CONF, 0x00, 0x00).then(function (response) {
        const result = {}
        result.arbitraryEnabled = (response[0] === 0x01)
        result.version = `${response[1]}.${response[2]}.${response[3]}`
        return result
      })
    }
  },
  {
    /**
    * get EosLedger public key for a given BIP 32 path.
    * @param path a path in BIP 32 format
    * @option boolValidate optionally enable key pair validation
    * @option boolDisplay optionally enable or not the display
    * @return an object with the publicKey
    * @example
    * const ledger = await ledgerAPI()
    * const key = await ledger.getPublicKey("44'/60'/0'", false, false)
    */

    key: 'getPublicKey',
    value: function getPublicKey (path, boolValidate, boolDisplay) {
      var _this = this

      // (0, checkEosBip32Path)(path)

      var apdus = []
      var response = void 0

      var pathElts = (0, splitPath)(path)
      var buffer = Buffer.alloc(1 + pathElts.length * 4)
      buffer[0] = pathElts.length
      pathElts.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 1 + 4 * index)
      })
      apdus.push(buffer)
      return (0, foreach)(apdus, function (data) {
        return _this.transport.send(CLA, INS_GET_PK, boolValidate ? 0x01 : 0x00, boolDisplay ? 0x01 : 0x00, data, [SW_OK, SW_KEEP_ALIVE]).then(function (apduResponse) {
          response = apduResponse
        })
      }).then(function () {
        let publicKeyLength = response[0]
        const addressLength = response[1 + publicKeyLength]
        let address = response.slice(
          1 + publicKeyLength + 1,
          1 + publicKeyLength + 1 + addressLength
        )
        var publicKey = response.slice(1, 1 + publicKeyLength)
        return {
          address: address.toString('ascii'),
          publicKey: publicKey.toString('hex')
        }
      })
    }

    /**
     * sign an EosLedger transaction.
     * @param path: a path in BIP 32 format
     * @param transaction: signature base of the transaction to sign
     * @return an object with the signature and the status
     * @example
     * eosLedger.signTransaction("44'/60'/0'", signatureBase).then(o => o.signature)
     */

  },
  {
    /**
    * sign an EosLedger transaction.
    * @param path: a path in BIP 32 format
    * @param transaction: serialized buffer of the transaction to sign
    * @return an object with the signature or an error string
    * @example
    * const { fc } = Eos(eosConfig)
    * const signTransaction = async (val, tx) => {
    *  let location = (typeof val === 'string') ? val : `${dPath.assumed}${val}'`
    *  const ledger = await ledgerAPI()
    *  const result = await ledger.signTransaction(location, tx)
    *   if (typeof result === 'string') {
    *     // check if result is a string - if string then it's an error message
    *     return result
    *   }
    *   let formattedSig = ecc.Signature.from(result.v + result.r + result.s)
    *   return formattedSig
    * }
    * const ledger = await ledgerAPI()
    * const buffer = await ledger.serialize(tx, eosConfig.chainId, fc.types)
    * const response = await signTransaction(path, buffer.toString('hex'))
    * if (typeof response === 'string') {
    *   // handle errors from the device
    *   return
    * }
    * tx.signatures.push(response.toString())
    * let r = await this.eos.pushTransaction(tx)
    */

    key: 'signTransaction',
    value: function signTransaction (path, rawTxHex) {
      const paths = bippath.fromString(path).toPathArray()
      let offset = 0
      const rawTx = Buffer.from(rawTxHex, 'hex')
      const toSend = []

      let response
      while (offset !== rawTx.length) {
        const maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 : 150
        const chunkSize =
                offset + maxChunkSize > rawTx.length
                  ? rawTx.length - offset
                  : maxChunkSize
        const buffer = Buffer.alloc(
          offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize
        )
        if (offset === 0) {
          buffer[0] = paths.length
          paths.forEach((element, index) => {
            buffer.writeUInt32BE(element, 1 + 4 * index)
          })
          rawTx.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize)
        }
        else {
          rawTx.copy(buffer, 0, offset, offset + chunkSize)
        }
        toSend.push(buffer)
        offset += chunkSize
      }
      return foreach(toSend, (data, i) =>
        this.transport.send(CLA, INS_SIGN, i === 0 ? P1_FIRST : P1_MORE, 0x00, data)
          .then(apduResponse => {
            response = apduResponse
            return response
          })
      )
        .then(() => {
          const v = response.slice(0, 1).toString('hex')
          const r = response.slice(1, 1 + 32).toString('hex')
          const s = response.slice(1 + 32, 1 + 32 + 32).toString('hex')
          return { v, r, s }
        })
        .catch(e => {
          console.log('error', e)
          return e.message
        })
    }
  },
  // {
    /**
    * sign the hash of an EosLedger transaction.
    * status: currently unusuable with @cryptofairys EOS Ledger device code
    * purpose: sign transactions that are too large for the ledger to handle such as smart contracts
    * @param path: a path in BIP 32 format
    * @param hash: hash of the transaction to sign
    * @return signed transaction hash
    */

    // key: 'signHash',
    // value: function signHash (path, hash) {
    //   (0, checkEosBip32Path)(path)
    //   return this.signHashPrivate(path, hash)
    // }
  // },
  {
    /**
    * Create a serialized buffer of the transaction to later sign
    * status: currently needed due to @cryptofairys EOS Ledger device code
    * @param transaction: an eos transaction object
    * @param chainId: chain id of the current eos network
    * @param types: types provided by the eosjs api
    * @return signed transaction hash
    * @example
    * const { fc } = Eos(eosConfig)
    * const ledger = await ledgerAPI()
    * const buffer = await ledger.serialize(tx, eosConfig.chainId, fc.types)
    */

    key: 'serialize',
    value: function serialize (transaction, chainId, types, multipleActions = false) {
      const tx = transaction.transaction
      const writter = new asn1.BerWriter()

      encode(writter, fcbuffer.toBuffer(types.checksum256(), chainId))
      encode(writter, fcbuffer.toBuffer(types.time(), tx.expiration))
      encode(writter, fcbuffer.toBuffer(types.uint16(), tx.ref_block_num))
      encode(
        writter,
        fcbuffer.toBuffer(types.uint32(), tx.ref_block_prefix)
      )
      encode(
        writter,
        fcbuffer.toBuffer(types.unsigned_int(), tx.max_net_usage_words)
      )
      encode(
        writter,
        fcbuffer.toBuffer(types.uint8(), tx.max_cpu_usage_ms)
      )
      encode(
        writter,
        fcbuffer.toBuffer(types.unsigned_int(), tx.delay_sec)
      )

      assert(tx.context_free_actions.length === 0)
      encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 0))

      /* Handle Multiple Actions */
      // let count = 1
      // encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 1))
      encode(writter, fcbuffer.toBuffer(types.unsigned_int(), tx.actions.length))
      for (var x of tx.actions) {
        console.log('action', x)

        // assert(tx.actions.length === 1)

        console.log('x.account', x.account)
        encode(writter, fcbuffer.toBuffer(types.account_name(), x.account))

        console.log('x.name', x.name)
        encode(writter, fcbuffer.toBuffer(types.action_name(), x.name))

        encode(
          writter,
          fcbuffer.toBuffer(types.unsigned_int(), x.authorization.length)
        )
        for (let i = 0; i < x.authorization.length; i += 1) {
          const authorization = x.authorization[i]

          encode(
            writter,
            fcbuffer.toBuffer(types.account_name(), authorization.actor)
          )
          encode(
            writter,
            fcbuffer.toBuffer(types.permission_name(), authorization.permission)
          )
        }

        let data = Buffer.from(x.data, 'hex')
        encode(writter, fcbuffer.toBuffer(types.unsigned_int(), data.length))
        encode(writter, data)
      }
      // }
      // else {
      //   const x = tx.actions[0]
      //   // console.log('action', x)
      //   // assert(tx.actions.length === 1)
      //
      //   encode(writter, fcbuffer.toBuffer(types.account_name(), x.account))
      //   encode(writter, fcbuffer.toBuffer(types.action_name(), x.name))
      //
      //   encode(
      //     writter,
      //     fcbuffer.toBuffer(types.unsigned_int(), x.authorization.length)
      //   )
      //   for (let i = 0; i < x.authorization.length; i += 1) {
      //     const authorization = x.authorization[i]
      //
      //     encode(
      //       writter,
      //       fcbuffer.toBuffer(types.account_name(), authorization.actor)
      //     )
      //     encode(
      //       writter,
      //       fcbuffer.toBuffer(types.permission_name(), authorization.permission)
      //     )
      //   }
      //
      //   let data = Buffer.from(x.data, 'hex')
      //   encode(writter, fcbuffer.toBuffer(types.unsigned_int(), data.length))
      //   encode(writter, data)
      // }
      assert(writter, tx.transaction_extensions.length === 0)
      encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 0))
      encode(writter, fcbuffer.toBuffer(types.checksum256(), Buffer.alloc(32, 0)))

      return writter.buffer
    }
  }
  // {
  //   key: 'signHashPrivate',
  //   value: function signHashPrivate (path, hash) {
  //     var _this3 = this

  //     var apdus = []
  //     var response = void 0

  //     var pathElts = (0, splitPath)(path)
  //     var buffer = Buffer.alloc(1 + pathElts.length * 4)
  //     buffer[0] = pathElts.length
  //     pathElts.forEach(function (element, index) {
  //       buffer.writeUInt32BE(element, 1 + 4 * index)
  //     })
  //     apdus.push(Buffer.concat([buffer, hash]))
  //     var keepAlive = false
  //     return (0, foreach)(apdus, function (data) {
  //       return _this3.transport.send(CLA, keepAlive ? INS_KEEP_ALIVE : INS_SIGN_TX_HASH, 0x00, 0x00, data, [SW_OK, SW_CANCEL, SW_NOT_ALLOWED, SW_UNSUPPORTED, SW_KEEP_ALIVE]).then(function (apduResponse) {
  //         var status = Buffer.from(apduResponse.slice(apduResponse.length - 2)).readUInt16BE(0)
  //         if (status === SW_KEEP_ALIVE) {
  //           keepAlive = true
  //           apdus.push(Buffer.alloc(0))
  //         }
  //         response = apduResponse
  //       })
  //     }).then(function () {
  //       var status = Buffer.from(response.slice(response.length - 2)).readUInt16BE(0)
  //       if (status === SW_OK) {
  //         var _signature3 = Buffer.from(response.slice(0, response.length - 2))
  //         return {
  //           signature: _signature3
  //         }
  //       }
  //       else if (status === SW_CANCEL) {
  //         throw new Error('Transaction approval request was rejected')
  //       }
  //       else if (status === SW_UNSUPPORTED) {
  //         throw new Error('Hash signing is not supported')
  //       }
  //       else {
  //         throw new Error('Hash signing not allowed. Have you enabled it in the app settings?')
  //       }
  //     })
  //   }
  // }
  ])
  return EosLedger
}())

function splitPath (path) {
  var result = []
  var components = path.split('/')
  components.forEach(function (element) {
    var number = parseInt(element, 10)
    if (isNaN(number)) {
      return
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000
    }
    result.push(number)
  })
  return result
}

function foreach (arr, callback) {
  function iterate (index, array, result) {
    if (index >= array.length) {
      return result
    }
    return callback(array[index], index)
      .then((res) => {
        result.push(res)
        return iterate(index + 1, array, result)
      })
  }
  return _promise2.default.resolve().then(function () {
    return iterate(0, arr, [])
  })
}
// function checkEosBip32Path (path) {
//   path.split('/').forEach(function (element) {
//     if (!element.toString().endsWith("'")) {
//       throw new Error('Detected a non-hardened path element in requested BIP32 path.' + ' Non-hardended paths are not supported at this time. Please use an all-hardened path.' + " Example: 44'/60'/0'")
//     }
//   })
// }

function encode (writter, buffer) {
  writter.writeBuffer(buffer, asn1.Ber.OctetString)
}

export default EosLedger
