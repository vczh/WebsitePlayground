import * as assert from 'assert';
import { route, RouterFragment, RouterFragmentKind, RouterParameterKind, RouterPattern } from '../src/mvc';

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
        parameter: ['name', RouterParameterKind.String]
    }]);
});

test(`/Demo-{title}`, () => {
    const rp = route`/Demo-${{ title: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Head,
        head: 'Demo-',
        parameter: ['title', RouterParameterKind.String]
    }]);
});

test(`/{title}.html`, () => {
    const rp = route`/${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Tail,
        tail: '.html',
        parameter: ['title', RouterParameterKind.String]
    }]);
});

test(`/Demo-{title}.html`, () => {
    const rp = route`/Demo-${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.HeadTail,
        head: 'Demo-',
        tail: '.html',
        parameter: ['title', RouterParameterKind.String]
    }]);
});

test(`/{a}-{b}`, () => {
    const rp = route`/${{ a: '' }}-${{ b: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.MultiplePatterns,
        pattern: /^(.+)\-(.+)$/.source,
        parameters: [['a', RouterParameterKind.String], ['b', RouterParameterKind.String]]
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
        parameter: ['head', RouterParameterKind.String]
    }, {
        kind: RouterFragmentKind.Tail,
        tail: 'Tail',
        parameter: ['tail', RouterParameterKind.String]
    }, {
        kind: RouterFragmentKind.Free,
        parameter: ['free', RouterParameterKind.String]
    }, {
        kind: RouterFragmentKind.HeadTail,
        head: 'Head',
        tail: 'Tail',
        parameter: ['both', RouterParameterKind.String]
    }, {
        kind: RouterFragmentKind.MultiplePatterns,
        pattern: /^Complex(.+)Pattern(.+)Example$/.source,
        parameters: [['a', RouterParameterKind.String], ['b', RouterParameterKind.String]]
    }]);
});
