import { html, render } from 'lit-html';

export const viewExport = {
    renderIndexView(model: { title: string }, target: Element): void {
        const htmlTemplate = html`Hello, <strong>${model.title}</strong>`;
        render(htmlTemplate, target);
    }
};
