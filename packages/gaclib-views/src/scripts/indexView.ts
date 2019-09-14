import { html, render } from 'lit-html';
import { ViewMetadata } from '../interfaces';

export const metadata: ViewMetadata = {
    name: 'Gaclib-IndexView',
    source: __filename,
    path: '/scripts/indexView.js',
    htmlInfo: {
        title: 'Hello, world!',
        shortcutIcon: '/favicon.ico',
        styleSheets: ['/global.css']
    }
};

export const viewExport = {
    renderIndexView(model: { title: string }, target: Element): void {
        const htmlTemplate = html`Hello, <strong>${model.title}</strong>`;
        render(htmlTemplate, target);
    }
};
