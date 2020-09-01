# HexClientApi

Hex APIs Node JS helper.

For full API specification please contact Hex Trust Ops Team

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
  const hexClient = new HexClientApi('api-domain', 'api-key-id', 'api secret');
  await hexClient.get('api-route');
})();
```

## To use nonce generator and validator

```js
const { HexApiUtilities } = require('hex-client-api');

let nonceValue = HexApiUtilities.getNonce();
let isValidNonce = HexApiUtilities.checkNonce(nonceValue);
```