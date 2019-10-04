// tslint:disable:no-submodule-imports
import { Article } from 'gaclib-article/lib/src/interfaces';
import { renderArticle } from 'gaclib-article/lib/src/rendering';
import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: {}, target: Element): void {
        const article = <Article>window['MVC-Resources.article'];
        const htmlTemplate = html`
${renderArticle(article)}
`;
        render(htmlTemplate, target);
    }
};
