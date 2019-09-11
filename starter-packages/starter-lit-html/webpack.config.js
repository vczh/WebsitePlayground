const path = require('path');

const indexView = {
    entry: './lib/raw/scripts/indexView.js',
    output: {
        path: path.resolve(__dirname, 'lib/dist/scripts'),
        filename: 'indexView.js'
    },
    mode: 'development'
};

module.exports = [
    indexView
];
