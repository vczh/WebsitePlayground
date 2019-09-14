import { route } from '../src';

test(`Empty pattern`, () => {
    expect(() => {
        return route``;
    }).toThrow();
});

test(`Pattern not begin with "/"`, () => {
    expect(() => {
        return route``;
    }).toThrow();
});

test(`Multiple properties in one parameter`, () => {
    expect(() => {
        return route`a`;
    }).toThrow();

    expect(() => {
        return route`${{ a: '' }}`;
    }).toThrow();
});

test(`Empty pattern bewteen "/"s`, () => {
    expect(() => {
        return route`/first//second`;
    }).toThrow();

    expect(() => {
        return route`/${{ a: '' }}//${{ b: '' }}`;
    }).toThrow();
});

test(`Empty pattern bewteen parameters`, () => {
    expect(() => {
        return route`/${{ a: '' }}${{ b: '' }}`;
    }).toThrow();

    expect(() => {
        return route`/first${{ a: '' }}${{ b: '' }}second`;
    }).toThrow();
});
