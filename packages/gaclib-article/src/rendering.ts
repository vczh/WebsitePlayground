import { html, TemplateResult } from 'lit-html';
import * as a from './interfaces';

export function renderArticle(article: a.Article): TemplateResult {
    return html`
<pre>${JSON.stringify(article, undefined, 4)}</pre>
`;
}
