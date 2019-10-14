const {HexClientApi} = require('../built/index.js');

(async () => {
  const hexClient = new HexClientApi('https://api-test2.hexsafe.io/', 'ann', 'secret456');
  await hexClient.get('/hexsafe/api/v3/account/asset/BTC/address/3MuatS4G2bG28bKBm7znAwywdFVDZv9fMSt');
})();
