import { ViewMetadata } from 'gaclib-render';

const rootView: ViewMetadata = {
    name: 'Gaclib-RootView',
    source: `${__dirname}/rootView.js`,
    path: '/scripts/rootView.js',
    containerId: 'rootViewContainer',
    htmlInfo: {
        shortcutIcon: '/favicon.ico',
        styleSheets: ['/global.css', '/navigation.css']
    }
};

const indexView: ViewMetadata = {
    name: 'Gaclib-IndexView',
    source: `${__dirname}/indexView.js`,
    path: '/scripts/indexView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib Website'
    }
};

export const views = [rootView, indexView];
