var mPackage = require('./package.json');
var mPackageLock = require('./package-lock.json');
var fs = require('fs');

function incVersion(v) {
    let s = v.split('.')
    let p = s.length - 1;
    s[p] = (parseInt(s[p]) + 1).toString();
    return s.join('.');
}

mPackage.version = incVersion(mPackage.version);
mPackageLock.version = incVersion(mPackageLock.version);

fs.writeFileSync('package.json', JSON.stringify(mPackage, null, '  '));
fs.writeFileSync('package-lock.json', JSON.stringify(mPackageLock, null, '  '));