# MEOW - (My EOS Wallet)

MEOW is a secure, private, free & cross-chain web-wallet on EOS! Inspired by MEW, MEOW allows EOS users to manage their accounts with hardware wallets in the browser - no downloads required. You can view the live site at https://www.altshiftdev.com.

## Installation

### Clone repository
`git clone https://github.com/altShiftDev/meow`
`cd meow`

### Install dependencies
`yarn install`

### Generated self-signed https certififcates (Ledger devices need HTTPS - even on localhost)
Use `npx tls-keygen` to create a self-signed certificate for localhost and place them one folder.

Go to meow/quasar.conf.js and edit the devServer to point to your new certificates:
```
    devServer: {
      https: {
        key: fs.readFileSync('../key.pem'),
        cert: fs.readFileSync('../cert.pem')
      },
      // port: 8080,
      open: true // opens browser window automatically
    }
```

### Build and Run with hot-reload at https://localhost:8080
`yarn dev`
