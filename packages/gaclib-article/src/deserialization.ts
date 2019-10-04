import { Element, xml2js } from 'xml-js';
import * as a from './interfaces';

function parseParagraph(xmlParagraph: Element): a.Paragraph {
    return {
        kind: 'Paragraph',
        content: []
    };
}

function parseTopic(xmlTopic: Element): a.Topic {
    let anchor: string | undefined;
    let title: string | undefined;
    const content: (a.Paragraph | a.Topic)[] = [];

    if (xmlTopic.attributes !== undefined) {
        for (const key of Object.keys(xmlTopic.attributes)) {
            switch (key) {
                case 'anchor': {
                    const anchorValue = xmlTopic.attributes.anchor;
                    if (typeof anchorValue === 'string') {
                        anchor = anchorValue;
                    } else {
                        throw new Error(`Attribute ${key} in <topic> should be a string.`);
                    }
                    break;
                }
                default:
                    throw new Error(`Unrecognized attribute ${key} in <topic>.`);
            }
        }
    }

    if (xmlTopic.elements !== undefined) {
        CHILD_LOOP:
        for (const xmlChild of xmlTopic.elements) {
            if (xmlChild.type === 'element') {
                switch (xmlChild.name) {
                    case 'title': {
                        if (xmlChild.elements !== undefined) {
                            if (xmlChild.elements.length === 1) {
                                const xmlText = xmlChild.elements[0];
                                if (xmlText.type === 'text' && typeof xmlText.text === 'string') {
                                    title = xmlText.text;
                                    continue CHILD_LOOP;
                                }
                            }
                            throw new Error('Only text should exist in <title>.');
                        } else {
                            throw new Error('<title> should not be empty.');
                        }
                    }
                    case 'p':
                        content.push(parseParagraph(xmlChild));
                        continue CHILD_LOOP;
                    case 'topic':
                        content.push(parseTopic(xmlChild));
                        continue CHILD_LOOP;
                    default:
                }
            }
            throw new Error('Only <title>, <p>, <topic> could exist in <topic>.');
        }
    }

    if (title === undefined) {
        throw new Error(`Exactly one <title> should exist in <topic>.`);
    }

    const topic: a.Topic = {
        kind: 'Topic',
        title,
        content
    };
    if (anchor !== undefined) {
        topic.anchor = anchor;
    }
    return topic;
}

export function parseArticle(xml: string): a.Article {
    const element = <Element>xml2js(
        xml,
        {
            compact: false,
            trim: true,
            ignoreDeclaration: true,
            ignoreInstruction: true,
            ignoreComment: true,
            ignoreDoctype: true
        }
    );

    if (element.elements !== undefined) {
        const xmlArticle = element.elements[0];
        if (xmlArticle.type === 'element' && xmlArticle.name === 'article') {
            let articleIndex = false;
            let articleNumberBeforeTitle = false;
            if (xmlArticle.attributes !== undefined) {
                for (const key of Object.keys(xmlArticle.attributes)) {
                    switch (key) {
                        case 'index':
                            switch (xmlArticle.attributes.index) {
                                case 'true': articleIndex = true; break;
                                case 'false': break;
                                default:
                                    throw new Error(`Attribute ${key} in <article> should be a boolean.`);
                            }
                            break;
                        case 'numberBeforeTitle':
                            switch (xmlArticle.attributes.numberBeforeTitle) {
                                case 'true': articleNumberBeforeTitle = true; break;
                                case 'false': break;
                                default:
                                    throw new Error(`Attribute ${key} in <article> should be a boolean.`);
                            }
                            break;
                        default:
                            throw new Error(`Unrecognized attribute ${key} in <article>.`);
                    }
                }
            }

            if (xmlArticle.elements !== undefined) {
                const xmlTopic = xmlArticle.elements[0];
                if (xmlTopic.type === 'element' || xmlTopic.name === 'topic') {
                    return {
                        index: articleIndex,
                        numberBeforeTitle: articleNumberBeforeTitle,
                        topic: parseTopic(xmlTopic)
                    };
                }
            }

            throw new Error(`Exactly one <topic> should exist in <article>.`);
        }
    }
    throw new Error(`Root element of an article should be <article> instead of <${element.name}>.`);

}
