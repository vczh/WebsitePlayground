import { ViewMetadata } from '../interfaces';

const indexView: ViewMetadata = {
    name: 'Gaclib-IndexView',
    source: `${__dirname}/indexView.js`,
    path: '/scripts/indexView.js',
    htmlInfo: {
        title: 'Hello, world!',
        shortcutIcon: '/favicon.ico',
        styleSheets: ['/global.css']
    }
};

export const views = [indexView];
