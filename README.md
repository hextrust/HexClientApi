# HexClientApi

Hex APIs Node JS helper.

For full API specification please contact Hex Trust Ops Team

Client API Docs see ./docs folder

To install:

```
npm i hex-client-api
```

To try it out:

```javascript
const { HexClientApi } = require('hex-client-api');
(async () => {
  const hexClient = new HexClientApi('api-domain', 'api-key-id', 'api secret');
  await hexClient.get('api-route');
})();
```
