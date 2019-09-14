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
        title: 'Gaclib Home Page'
    }
};

const tutorialView: ViewMetadata = {
    name: 'Gaclib-TutorialView',
    source: `${__dirname}/tutorialView.js`,
    path: '/scripts/tutorialView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib -- Tutorial'
    }
};

const demoView: ViewMetadata = {
    name: 'Gaclib-DemoView',
    source: `${__dirname}/demoView.js`,
    path: '/scripts/demoView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib -- Demo'
    }
};

const downloadView: ViewMetadata = {
    name: 'Gaclib-DownloadView',
    source: `${__dirname}/downloadView.js`,
    path: '/scripts/downloadView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib -- Download'
    }
};

const documentView: ViewMetadata = {
    name: 'Gaclib-DocumentView',
    source: `${__dirname}/documentView.js`,
    path: '/scripts/documentView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib -- Document'
    }
};

const contactView: ViewMetadata = {
    name: 'Gaclib-ContactView',
    source: `${__dirname}/contactView.js`,
    path: '/scripts/contactView.js',
    parentView: 'Gaclib-RootView',
    htmlInfo: {
        title: 'Gaclib -- Contact'
    }
};

export const views = [rootView, indexView, tutorialView, demoView, downloadView, documentView, contactView];
