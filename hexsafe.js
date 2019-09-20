const HexClientApi = require('./HexClientApi');
const hexApi = new HexClientApi('test-user', 'test-user-123', 'api-test2.hexsafe.io');
const genNonce = require('./nonce.js');
let nonceIncr;
let last;

let nonce = genNonce();
let depositBody = {
  quantity:112938000000000000,
  note:'API Deposit'
};

hexApi.rest('POST', '/hexsafe/api/v2/deposit/account/14/wallet_type/1/asset/ETH', depositBody, null, nonce)
 .then(res => console.log(res))

//
// const addressVerificationBody = {
//   message: {
//     verification_code: 'CdKbIKQeG4Ii5IaMne5fvMAeR'
//   },
//   signature:'0x60d929af570dd882713f02189da93b40feda61e40cc17bc2a042b9bb7025800d541128aefe1ee0ad638676409e692b2dbf30c2a13727a8423995ebb5455c604c1c',
//   address:'0x0e7374a9cbcd26b922678a0ff2045a28ce1ecbc4',
// }
//
// hexApi.rest('POST', '/hexsafe/api/v3/address/asset_type/ETH/verify', addressVerificationBody, '', nonce)
// .then(res =>
//   hexApi.rest('GET', '/hexsafe/api/v3/address/asset_type/ETH/verify/address/' + res, '', '', nonce)
//   .then(res => console.log(res))
// );
