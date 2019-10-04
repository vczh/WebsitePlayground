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
