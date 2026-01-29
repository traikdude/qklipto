try {
    const req = require('module').createRequire('c:/');
    const e = req('electron');
    console.log('Root Require electron keys:', Object.keys(e));
} catch (err) {
    console.log('Root Require failed:', err.message);
}
