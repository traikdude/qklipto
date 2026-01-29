const { app } = require('electron');
try {
    console.log('Resolved Electron:', require.resolve('electron'));
} catch (e) { console.log('Resolve failed:', e.message); }
console.log('App:', app ? 'Defined' : 'Undefined');
if (app) app.quit();
