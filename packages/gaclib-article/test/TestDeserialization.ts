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
