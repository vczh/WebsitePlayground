import * as assert from 'assert';
import { createRouter, HttpMethods, route } from '../src';

test(`Query not begin with "/"`, () => {
    expect(() => {
        createRouter<{}>().match('GET', '');
    }).toThrow();
});

function returnMethod(method: HttpMethods, value: {}): HttpMethods {
    return method;
}

test(`Query mismatched`, () => {
    const router = createRouter<{}>();
    router.register(['GET'], route`/index.html`, returnMethod);
    assert.deepStrictEqual(router.match('GET', '/'), undefined);
});

test(`Query match methods`, () => {
    const router = createRouter<HttpMethods>();
    router.register(['GET'], route`/`, returnMethod);
    router.register(['POST', 'PUT'], route`/`, returnMethod);
    router.register(['DELETE'], route`/`, returnMethod);

    assert.deepStrictEqual(router.match('GET', '/'), 'GET');
    assert.deepStrictEqual(router.match('POST', '/'), 'POST');
    assert.deepStrictEqual(router.match('PUT', '/'), 'PUT');
    assert.deepStrictEqual(router.match('DELETE', '/'), 'DELETE');
    assert.deepStrictEqual(router.match('PATCH', '/'), undefined);
});
