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
