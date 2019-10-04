import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: {}, target: Element): void {
        const htmlTemplate = html`
Hello, navTutorial.
`;
        render(htmlTemplate, target);
    }
};
