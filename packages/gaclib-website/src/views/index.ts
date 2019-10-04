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

const articleView: ViewMetadata = {
    name: 'Gaclib-ArticleView',
    source: `${__dirname}/articleView.js`,
    path: '/scripts/articleView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {}
};

export const views = [rootView, articleView];
