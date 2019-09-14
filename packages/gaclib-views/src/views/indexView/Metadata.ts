import { ViewMetadata } from '../../interfaces';

export const metadata: ViewMetadata = {
    name: 'Gaclib-IndexView',
    source: `${__dirname}/View.js`,
    path: '/scripts/indexView.js',
    htmlInfo: {
        title: 'Hello, world!',
        shortcutIcon: '/favicon.ico',
        styleSheets: ['/global.css']
    }
};
