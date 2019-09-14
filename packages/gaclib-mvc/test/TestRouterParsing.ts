import * as assert from 'assert';
import { route, RouterFragment, RouterFragmentKind, RouterParameterKind, RouterPattern } from '../src';

function assertFragments<T>(rp: RouterPattern<T>, expected: RouterFragment[]): void {
    assert.deepStrictEqual(rp.fragments, expected);
}

function assertDefaultValue<T>(rp: RouterPattern<T>, expected: T): void {
    assert.deepStrictEqual(rp.createDefaultValue(), expected);
}

test(`/`, () => {
    const rp = route`/`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Text,
        text: ''
    }]);
    assertDefaultValue(rp, {});
});

test(`/index.html`, () => {
    const rp = route`/index.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Text,
        text: 'index.html'
    }]);
    assertDefaultValue(rp, {});
});

test(`/{name}`, () => {
    const rp = route`/${{ name: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Free,
        parameter: ['name', RouterParameterKind.String]
    }]);
    assertDefaultValue(rp, { name: '' });
});

test(`/Demo-{title}`, () => {
    const rp = route`/Demo-${{ title: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Head,
        head: 'Demo-',
        parameter: ['title', RouterParameterKind.String]
    }]);
    assertDefaultValue(rp, { title: '' });
});

test(`/{title}.html`, () => {
    const rp = route`/${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Tail,
        tail: '.html',
        parameter: ['title', RouterParameterKind.String]
    }]);
    assertDefaultValue(rp, { title: '' });
});

test(`/Demo-{title}.html`, () => {
    const rp = route`/Demo-${{ title: '' }}.html`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.HeadTail,
        head: 'Demo-',
        tail: '.html',
        parameter: ['title', RouterParameterKind.String]
    }]);
    assertDefaultValue(rp, { title: '' });
});

test(`/{a}-{b}`, () => {
    const rp = route`/${{ a: '' }}-${{ b: '' }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.MultiplePatterns,
        pattern: /^(.+)\-(.+)$/.source,
        parameters: [['a', RouterParameterKind.String], ['b', RouterParameterKind.String]]
    }]);
    assertDefaultValue(rp, { a: '', b: '' });
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
    assertDefaultValue(rp, { head: '', tail: '', free: '', both: '', a: '', b: '' });
});

test(`/{s}/{n}/{b}`, () => {
    const rp = route`/${{ s: 'ignored' }}/${{ n: 9999 }}/${{ b: true }}`;
    assertFragments(rp, [{
        kind: RouterFragmentKind.Free,
        parameter: ['s', RouterParameterKind.String]
    }, {
        kind: RouterFragmentKind.Free,
        parameter: ['n', RouterParameterKind.Number]
    }, {
        kind: RouterFragmentKind.Free,
        parameter: ['b', RouterParameterKind.Boolean]
    }]);
    assertDefaultValue(rp, { s: '', n: 0, b: false });
});
