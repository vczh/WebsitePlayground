import { html, TemplateResult } from 'lit-html';
import * as a from './interfaces';

function renderListContent(list: a.List): TemplateResult {
    return html`${
        list
            .items
            .map((value: a.ContentListItem | a.ParagraphListItem) => {
                if (value.kind === 'ContentListItem') {
                    return html`<li>${renderContent(value.content)}</li>`;
                } else {
                    return html`<li>${value.paragraphs.map(renderParagraph)}</li>`;
                }
            })
        }`;
}

function renderContent(content: a.Content[]): TemplateResult {
    return html`${
        content
            .map((value: a.Content) => {
                switch (value.kind) {
                    case 'PageLink':
                        return html`<a href="${value.href}" target="${value.href.startsWith('.') ? '_self' : '_blank'}">${renderContent(value.content)}</a>`;
                    case 'AnchorLink':
                        throw new Error('AnchorLink is not supported yet.');
                    case 'Name':
                        return html`<span class="name">${value.text}</span>`;
                    case 'Image':
                        if (value.caption === undefined) {
                            return html`<img src="${value.src}">`;
                        } else {
                            return html`<figure><img src="${value.src}"><figcaption>${value.caption}</figcaption></figure>`;
                        }
                    case 'List':
                        if (value.ordered) {
                            return html`<ol>${renderListContent(value)}</ol>`;
                        } else {
                            return html`<ul>${renderListContent(value)}</ul>`;
                        }
                    case 'Strong':
                        return html`<strong>${renderContent(value.content)}</strong>`;
                    case 'Emphasise':
                        return html`<em>${renderContent(value.content)}<em>`;
                    case 'Program':
                        throw new Error('Program is not supported yet.');
                    default:
                        return value.text;
                }
            })
        }`;
}

function renderParagraph(paragraph: a.Paragraph): TemplateResult {
    return html`<p>${renderContent(paragraph.content)}</p>`;
}

function renderHeader(level: number, content: TemplateResult): TemplateResult {
    switch (level) {
        case 1: return html`<h1>${content}</h1>`;
        case 2: return html`<h2>${content}</h2>`;
        case 3: return html`<h3>${content}</h3>`;
        case 4: return html`<h4>${content}</h4>`;
        case 5: return html`<h5>${content}</h5>`;
        default: return html`<h6>${content}</h6>`;
    }
}

function renderTopic(topic: a.Topic, level: number): TemplateResult {
    return html`
${
        renderHeader(
            level,
            html`
${topic.anchor === undefined ? html`` : html`<a id="${topic.anchor}"></a>`}
${topic.title}
        `)
        }
${
        topic
            .content
            .map((value: a.Topic | a.Paragraph) => {
                return value.kind === 'Topic' ? renderTopic(value, level + 1) : renderParagraph(value);
            })
        }
`;
}

export function renderArticle(article: a.Article): TemplateResult {
    return html`<div class="article">${renderTopic(article.topic, 1)}<div>`;
}