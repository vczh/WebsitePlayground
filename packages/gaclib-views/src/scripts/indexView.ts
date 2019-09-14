import { html, render, TemplateResult } from 'lit-html';

class IndexView {
    constructor(public title: string) {
    }

    public getTemplate(): TemplateResult {
        return html`Hello, <strong>${this.title}</strong>`;
    }
}

export namespace indexView {
    export function renderIndexView(title: string, target: Element): void {
        const view = new IndexView(title);
        render(view.getTemplate(), target);
    }
}
