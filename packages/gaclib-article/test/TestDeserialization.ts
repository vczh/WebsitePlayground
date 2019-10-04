import * as assert from 'assert';
import { Article, parseArticle } from '../src';

test(`Empty Article`, () => {
    const input = `
<article>
    <topic>
        <title>Title</title>
    </topic>
</article>
`;
    const output: Article = {
        index: false,
        numberBeforeTitle: false,
        topic: {
            kind: 'Topic',
            title: 'Title',
            content: []
        }
    };
    assert.deepStrictEqual(parseArticle(input), output);
});

test(`Article with attributes`, () => {
    const input = `
<article index="true" numberBeforeTitle="true">
    <topic>
        <title>Title</title>
    </topic>
</article>
`;
    const output: Article = {
        index: true,
        numberBeforeTitle: true,
        topic: {
            kind: 'Topic',
            title: 'Title',
            content: []
        }
    };
    assert.deepStrictEqual(parseArticle(input), output);
});

test(`Nested topics`, () => {
    const input = `
<article>
    <topic>
        <title>Article</title>
        <topic><title>1.h2</title></topic>
        <topic>
            <topic><title>2.1.h3</title></topic>
            <topic><title>2.2.h3</title></topic>
            <title>2.h2</title>
        </topic>
    </topic>
</article>
`;
    const output: Article = {
        index: false,
        numberBeforeTitle: false,
        topic: {
            kind: 'Topic',
            title: 'Article',
            content: [
                {
                    kind: 'Topic',
                    title: '1.h2',
                    content: []
                },
                {
                    kind: 'Topic',
                    title: '2.h2',
                    content: [
                        {
                            kind: 'Topic',
                            title: '2.1.h3',
                            content: []
                        },
                        {
                            kind: 'Topic',
                            title: '2.2.h3',
                            content: []
                        }
                    ]
                }
            ]
        }
    };
    assert.deepStrictEqual(parseArticle(input), output);
});

test(`Flat paragraph`, () => {
    const input = `
<article>
    <topic>
        <title>Article</title>
        <p>
            <a href="./index.html"><b>Hey</b>, this is <em>an article</em>.</a>
            <a anchor="Anchor"/>
            <name>GuiControl</name>
            <img src="logo.png"/>
            <img src="logo.png">This is a logo</img>
        </p>
    </topic>
</article>
`;
    const output: Article = {
        index: false,
        numberBeforeTitle: false,
        topic: {
            kind: 'Topic',
            title: 'Article',
            content: [
                {
                    kind: 'Paragraph',
                    content: [
                        {
                            kind: 'PageLink',
                            href: './index.html',
                            content: [
                                {
                                    kind: 'Strong',
                                    content: [{ kind: 'Text', text: 'Hey' }]
                                },
                                {
                                    kind: 'Text',
                                    text: ', this is  '
                                },
                                {
                                    kind: 'Emphasise',
                                    content: [{ kind: 'Text', text: 'an article' }]
                                },
                                {
                                    kind: 'Text',
                                    text: '.'
                                }
                            ]
                        },
                        {
                            kind: 'AnchorLink',
                            anchor: 'Anchor',
                            content: []
                        },
                        {
                            kind: 'Name',
                            text: 'GuiControl'
                        },
                        {
                            kind: 'Image',
                            src: 'logo.png'
                        },
                        {
                            kind: 'Image',
                            src: 'logo.png',
                            caption: 'This is a logo'
                        }
                    ]
                }
            ]
        }
    };
    assert.deepStrictEqual(parseArticle(input), output);
});
