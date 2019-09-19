
let last = new Date().getTime();
let nonceIncr = -1

const getNonce = () => {
	const now = new Date().getTime();
	if (now !== last) {
  		nonceIncr = -1;
	}
	last = now;
	nonceIncr++;
	// add padding to nonce incr
	// @link https://stackoverflow.com/questions/6823592/numbers-in-the-form-of-001
  const padding =
    nonceIncr < 10 ? '000' :
    nonceIncr < 100 ? '00' :
    nonceIncr < 1000 ? '0' : '';
  return now + padding + nonceIncr;
}

module.exports = (getNonce);
