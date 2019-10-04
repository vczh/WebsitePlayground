import { Element, xml2js } from 'xml-js';
import * as a from './interfaces';

function parseTextContent(container: Element, allowEmpty: boolean): string {
    if (container.elements !== undefined) {
        if (container.elements.length === 1) {
            const xmlText = container.elements[0];
            if (xmlText.type === 'text' && typeof xmlText.text === 'string') {
                return xmlText.text;
            }
        }
        throw new Error(`Only text should exist in <${container.name}>.`);
    } else {
        if (allowEmpty) {
            return '';
        } else {
            throw new Error(`<${container.name}> should not be empty.`);
        }
    }
}

function parseContent(container: Element): a.Content[] {
    const content: a.Content[] = [];
    if (container.elements !== undefined) {
        CHILD_LOOP:
        for (const xmlChild of container.elements) {
            switch (xmlChild.type) {
                case 'text':
                    if (typeof xmlChild.text === 'string') {
                        content.push({
                            kind: 'Text',
                            text: xmlChild.text
                        });
                    }
                    break;
                case 'element':
                    switch (xmlChild.name) {
                        case 'a': {
                            if (xmlChild.attributes !== undefined) {
                                const atts = Object.keys(xmlChild.attributes);
                                if (atts.length === 1) {
                                    switch (atts[0]) {
                                        case 'href':
                                            if (typeof xmlChild.attributes.href !== 'string') {
                                                throw new Error(`Attribute ${atts[0]} in <a> should be a string.`);
                                            }
                                            content.push({
                                                kind: 'PageLink',
                                                href: xmlChild.attributes.href,
                                                content: parseContent(xmlChild)
                                            });
                                            continue CHILD_LOOP;
                                        case 'anchor':
                                            if (typeof xmlChild.attributes.anchor !== 'string') {
                                                throw new Error(`Attribute ${atts[0]} in <a> should be a string.`);
                                            }
                                            content.push({
                                                kind: 'AnchorLink',
                                                anchor: xmlChild.attributes.anchor,
                                                content: parseContent(xmlChild)
                                            });
                                            continue CHILD_LOOP;
                                        default:
                                    }
                                }
                            }
                            throw new Error('Exactly one "href" or "anchor" attribute should exist in <a>.');
                        }
                        case 'symbol': {
                            throw new Error('<symbol> is not supported yet.');
                        }
                        case 'name': {
                            if (xmlChild.attributes !== undefined && xmlChild.attributes.length !== 0) {
                                throw new Error('No attribute is allowed in <name>.');
                            }
                            content.push({
                                kind: 'Name',
                                text: parseTextContent(xmlChild, false)
                            });
                            continue CHILD_LOOP;
                        }
                        case 'img': {
                            if (xmlChild.attributes !== undefined) {
                                const atts = Object.keys(xmlChild.attributes);
                                if (atts.length === 1) {
                                    switch (atts[0]) {
                                        case 'src':
                                            if (typeof xmlChild.attributes.src !== 'string') {
                                                throw new Error(`Attribute ${atts[0]} in <img> should be a string.`);
                                            }
                                            const caption = parseTextContent(xmlChild, true);
                                            if (caption === '') {
                                                content.push({
                                                    kind: 'Image',
                                                    src: xmlChild.attributes.src
                                                });
                                            } else {
                                                content.push({
                                                    kind: 'Image',
                                                    src: xmlChild.attributes.src,
                                                    caption
                                                });
                                            }
                                            continue CHILD_LOOP;
                                        default:
                                    }
                                }
                            }
                            throw new Error('Exactly one "src" attribute should exist in <img>.');
                            continue CHILD_LOOP;
                        }
                        case 'ul': case 'ol': {
                            continue CHILD_LOOP;
                        }
                        case 'b': {
                            if (xmlChild.attributes !== undefined && xmlChild.attributes.length !== 0) {
                                throw new Error('No attribute is allowed in <b>.');
                            }
                            content.push({
                                kind: 'Strong',
                                content: parseContent(xmlChild)
                            });
                            continue CHILD_LOOP;
                        }
                        case 'em': {
                            if (xmlChild.attributes !== undefined && xmlChild.attributes.length !== 0) {
                                throw new Error('No attribute is allowed in <em>.');
                            }
                            content.push({
                                kind: 'Emphasise',
                                content: parseContent(xmlChild)
                            });
                            continue CHILD_LOOP;
                        }
                        case 'program': {
                            continue CHILD_LOOP;
                        }
                        default:
                            throw new Error(`Only text, <a>, <symbol>, <name>, <img>, <ul>, <ol>, <b>, <em>, <program> are allowed in <${container.name}> instead of <${xmlChild.name}>.`);
                    }
                default:
                    throw new Error(`Only text and elements are allowed in <${container.name}> instead of ${xmlChild.type}.`);
            }
        }
    }
    return content;
}

function parseParagraph(xmlParagraph: Element): a.Paragraph {
    return {
        kind: 'Paragraph',
        content: parseContent(xmlParagraph)
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
                        title = parseTextContent(xmlChild, false);
                        continue CHILD_LOOP;
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
            throw new Error('Only <title>, <p>, <topic> are allowed in <topic>.');
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
