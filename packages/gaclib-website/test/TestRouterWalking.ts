import * as assert from 'assert';
import { route, RouterPattern } from '../src/mvc';

function assertWalk<T>(rp: RouterPattern<T>, url: string, expected: T): void {
    const fragments = url.split('/');
    assert.strictEqual(fragments.length, rp.fragments.length + 1);

    const value = rp.createDefaultValue();
    for (let i = 0; i < rp.fragments.length; i++) {
        assert.strictEqual(rp.walk(fragments[i + 1], rp.fragments[i], value), true);
    }
    assert.deepStrictEqual(value, expected);
}

test(`/`, () => {
    const rp = route`/`;
    const url = '/';
    assertWalk(rp, url, {});
});

test(`/index.html`, () => {
    const rp = route`/index.html`;
    const url = '/index.html';
    assertWalk(rp, url, {});
});

test(`/{x}`, () => {
    const rp = route`/${{ x: '' }}`;
    const url = '/GaclibWebsiteMvc';
    assertWalk(rp, url, { x: 'GaclibWebsiteMvc' });
});

test(`/Gaclib{x}`, () => {
    const rp = route`/Gaclib${{ x: '' }}`;
    const url = '/GaclibWebsiteMvc';
    assertWalk(rp, url, { x: 'WebsiteMvc' });
});

test(`/{x}Mvc`, () => {
    const rp = route`/${{ x: '' }}Mvc`;
    const url = '/GaclibWebsiteMvc';
    assertWalk(rp, url, { x: 'GaclibWebsite' });
});

test(`/Gaclib{x}Mvc`, () => {
    const rp = route`/Gaclib${{ x: '' }}Mvc`;
    const url = '/GaclibWebsiteMvc';
    assertWalk(rp, url, { x: 'Website' });
});

test(`/{a}.{b}.{c}.{d}`, () => {
    const rp = route`/${{ a: '' }}.${{ b: '' }}.${{ c: '' }}.${{ d: '' }}`;
    const url = '/127.0.0.1';
    assertWalk(rp, url, { a: '127', b: '0', c: '0', d: '1' });
});

test(`/Tutorial/{tutorial}/Demo/{title}.html`, () => {
    const rp = route`/Tutorial/${{ tutorial: '' }}/Demo/${{ title: '' }}.html`;
    const url = '/Tutorial/HelloWorld/Demo/CppXml.html';
    assertWalk(rp, url, { tutorial: 'HelloWorld', title: 'CppXml' });
});
