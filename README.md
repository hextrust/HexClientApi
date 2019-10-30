# HexClientApi

Hex APIs Node JS helper.

For full API specification please refer to: https://api-test2.hexsafe.io/hexsafe/swagger/

## Client Docs:

[Client Docs](../docs/index.html)

## To install:

```
npm i hex-client-api
```

## To try it out:

```js
const { HexClientApi } = require('hex-client-api');
(async () => {
  const hexClient = new HexClientApi('https://api-test2.hexsafe.io/', 'api-key-id', 'api secret');
  await hexClient.get('/hexsafe/api/v3/account/asset/BTC/address/3MuatS4G2bG28bKBm7znAwywdFVDZv9fMSt');
})();
```

## To use nonce generator and validator

```js
const { HexApiUtilities } = require('hex-client-api');

let nonceValue = HexApiUtilities.getNonce();
let isValidNonce = HexApiUtilities.checkNonce(nonceValue);
```