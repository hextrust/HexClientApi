const HexClientApi = require('./HexClientApi');

const hexApi = new HexClientApi('client2user1', 'test', 'localhost:8000');

let account = {
  name: "Roger Hexski"
};


hexApi.rest('GET', '/api/v1/account',null,{ created_date: 1567757913147}).then(res => console.log(res));

// hexApi.rest('POST', '/api/v1/account',null,{ created_date: 1567757913147}).then(res => console.log(res));

//hexApi.rest('GET', '/api/v1/deposit/678cf535-2b7d-4d0a-8ad6-deb1794b7aef').then(res => console.log(res));
//hexApi.rest('PATCH', '/api/v1/deposit/020caa06-3615-4a98-b020-72e18cc73095').then(res => console.log(res));
//hexApi.rest('GET', '/api/v1/deposit/678cf535-2b7d-4d0a-8ad6-deb1794b7aef').then(res => console.log(res));


hexApi.rest('POST', '/api/v1/deposit', null, { account_uuid: '1264bb68-d324-4c0e-8841-886d5059dddb', asset_ticker: 'USDC', amount: 1.410000 } ).then(res => console.log(res))


hexApi.rest('GET', '/api/v1/deposit').then(res => console.log(res));
/*
hexApi.rest('PATCH', '/api/v1/deposit/e36710ce-509d-40ac-8174-845fe08fc676').then(res => console.log(res));

hexApi.rest('GET', '/api/v1/deposit/e36710ce-509d-40ac-8174-845fe08fc676').then(res => console.log(res));
*/

//hexApi.rest('GET', '/api/v1/deposit',null, { uuid: 'e36710ce-509d-40ac-8174-845fe08fc676' } ).then(res => console.log(res));
//hexApi.rest('GET', '/api/v1/deposit',null, { created_date: 1568133291137 } ).then(res => console.log(res));


//hexApi.rest('POST', '/api/v1/deposit', null, { account_uuid: '1264bb68-d324-4c0e-8841-886d5059dddb', asset_ticker: 'USDC', amount: 1112938000000000000 } ).then(res => console.log(res))
/*
console.log('GET /account by uuid in query parameter');
hexApi.rest('GET', '/api/v1/account',null, { uuid: '63c9c2fc-ea0e-4c3d-844a-e8d2d885e073' })
  .then(res => console.log(res));

console.log('GET /account by uuid in path');
hexApi.rest('GET', '/api/v1/account/63c9c2fc-ea0e-4c3d-844a-e8d2d885e073')
  .then(res => console.log(res));

console.log('GET /account with offset and limit');
hexApi.rest('GET', '/api/v1/account',null, { offset: 0, limit: 2})
  .then(res => console.log(res));

console.log('Create account');
hexApi.rest('POST', '/api/v1/account', account)
  .then(res => console.log(res));
console.log('GET /account created since given date timestamp');
*/
