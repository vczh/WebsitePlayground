import * as assert from 'assert';
import { route, RouterFragment, RouterFragmentKind, RouterPattern } from '../src/mvc';

function assertFragments<T>(rp: RouterPattern<T>, expect: RouterFragment[]): void {
    assert.deepStrictEqual(rp.fragments, expect);
}

test(`/`, () => {
    const rp = route`/`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Text,
        text: ''
    }]);
});

test(`/index.html`, () => {
    const rp = route`/index.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Text,
        text: 'index.html'
    }]);
});

test(`/{name}`, () => {
    const rp = route`/${{ name: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Free,
        name: 'name'
    }]);
});

test(`/Demo-{title}`, () => {
    const rp = route`/Demo-${{ title: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Head,
        head: 'Demo-',
        name: 'title'
    }]);
});

test(`/{title}.html`, () => {
    const rp = route`/${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Tail,
        tail: '.html',
        name: 'title'
    }]);
});

test(`/Demo-{title}.html`, () => {
    const rp = route`/Demo-${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.HeadTail,
        head: 'Demo-',
        tail: '.html',
        name: 'title'
    }]);
});

test(`/{a}-{b}`, () => {
    const rp = route`${{ a: '' }}-${{ b: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.MultiplePatterns,
        pattern: /^(.+)\-(.+)$/.source,
        names: ['a', 'b']
    }]);
});

test(`/Text/Head{head}/{tail}Tail/{free}/Head{both}Tail/Complex{a}Pattern{b}Example`, () => {

    const rp = route`/Text/Head${{ head: '' }}/${{ tail: '' }}Tail/${{ free: '' }}/Head${{ both: '' }}Tail/Complex${{ a: '' }}Pattern${{ b: '' }}Example`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Text,
        text: 'Text'
    }, {
        kind: RouterFragmentKind.Head,
        head: 'Head',
        name: 'head'
    }, {
        kind: RouterFragmentKind.Tail,
        tail: 'Tail',
        name: 'tail'
    }, {
        kind: RouterFragmentKind.Free,
        name: 'free'
    }, {
        kind: RouterFragmentKind.HeadTail,
        head: 'Head',
        tail: 'Tail',
        name: 'both'
    }, {
        kind: RouterFragmentKind.MultiplePatterns,
        pattern: /^Complex(.+)Pattern(.+)Example/.source,
        names: ['a', 'b']
    }]);
});
