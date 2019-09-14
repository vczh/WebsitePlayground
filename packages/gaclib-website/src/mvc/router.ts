// why @types/escape-string-regexp doesn't work?
const escapeStringRegexp = <(str: string) => string>require('escape-string-regexp');
import { RouterFragment, RouterFragmentKind, RouterParameterTypes, RouterPattern, RouterPatternBase } from './interfaces';

// if the type of a property is one of RouterParameterTypes, then convert the type of the property to be the key
type ValidPropertiesToKeys<T> = { [P in keyof T]: T[P] extends RouterParameterTypes ? P : never; };

// get all property types that is not never
type ValidPropertyTypes<T> = T[keyof T];

// remove properties that do not have a type in RouterParameterTypes
type FilterOutInvalidProperties<T> = Pick<T, ValidPropertyTypes<ValidPropertiesToKeys<T>>>;

// A|B|... -> ((k:FIOP<A>)=>void)|((k:FIOP<B>)=>void)|... -> (k:FIOP<A>&FIOP<B>&...)=>void -> FIOP<A>&FIOP<B>&...
type MergeParameters<U> = (U extends {} ? (k: FilterOutInvalidProperties<U>) => void : never) extends ((k: infer I) => void) ? I : never;

function getParameterName(fragment: {}): string | undefined {
    if (typeof fragment === 'string') {
        return undefined;
    }

    const keys = Object.keys(fragment);
    if (keys.length === 1) {
        switch (typeof fragment[keys[0]]) {
            case 'string':
            case 'number':
            case 'boolean': {
                return keys[0];
            }
            default:
                throw new Error(`The property of the parameter object "${JSON.stringify(fragment)}" can only be string, number or boolean.`);
        }
    }
    throw new Error(`Parameter object "${JSON.stringify(fragment)}" should have exactly one property.`);
}

class RouterPatternImpl implements RouterPatternBase {
    public fragments: RouterFragment[] = [];

    constructor(strings: TemplateStringsArray, parameters: {}[]) {
        if (strings.length - parameters.length !== 1) {
            throw new Error('TypeScript does not compile route literal correctly!');
        }
        if (strings[0].length === 0 || strings[0][0] !== '/') {
            throw new Error('Pattern should begin with "/".');
        }

        let fragmentBuilders: {}[] = [];
        for (let i = 0; i < strings.length; i++) {
            const fragments = strings[i]
                .substr(i === 0 ? 1 : 0)
                .split('/')
                .map(escapeStringRegexp);
            for (let j = 0; j < fragments.length; j++) {
                if (j > 0) {
                    this.submitFragment(fragmentBuilders);
                    fragmentBuilders = [];
                }

                fragmentBuilders.push(fragments[j]);
            }

            if (i < parameters.length) {
                fragmentBuilders.push(parameters[i]);
            }
        }
        this.submitFragment(fragmentBuilders);
    }

    public createDefaultValue(): {} {
        throw new Error('Not Implemented');
    }

    public walk(text: string, fragment: RouterFragment, value: {}): boolean {
        throw new Error('Not Implemented');
    }

    private submitFragment(fragmentBuilders: {}[]): void {
        switch (fragmentBuilders.length) {
            case 0: return;
            case 1: {
                const name = getParameterName(fragmentBuilders[0]);
                if (name === undefined) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Text,
                        text: <string>fragmentBuilders[0]
                    });
                    return;
                } else {
                    this.fragments.push({
                        kind: RouterFragmentKind.Free,
                        name
                    });
                    return;
                }
            }
            case 2: {
                const name1 = getParameterName(fragmentBuilders[0]);
                const name2 = getParameterName(fragmentBuilders[1]);
                if (name1 === undefined && name2 !== undefined) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Head,
                        head: <string>fragmentBuilders[1],
                        name: name2
                    });
                    return;
                } else if (name1 !== undefined && name2 === undefined) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Tail,
                        tail: <string>fragmentBuilders[1],
                        name: name1
                    });
                    return;
                }
            }
            case 3: {
                const name1 = getParameterName(fragmentBuilders[0]);
                const name2 = getParameterName(fragmentBuilders[1]);
                const name3 = getParameterName(fragmentBuilders[2]);
                if (name1 === undefined && name2 !== undefined && name3 === undefined) {
                    this.fragments.push({
                        kind: RouterFragmentKind.HeadTail,
                        head: <string>fragmentBuilders[0],
                        tail: <string>fragmentBuilders[2],
                        name: name2
                    });
                    return;
                }
            }
            default:
        }

        let pattern = '';
        const names: string[] = [];
        for (const fragment of fragmentBuilders) {
            const name = getParameterName(fragment);
            if (name === undefined) {
                pattern += <string>fragment;
            } else {
                pattern += '(.+)';
                names.push(name);
            }
        }
        this.fragments.push({
            kind: RouterFragmentKind.MultiplePatterns,
            pattern,
            names
        });
    }
}

export function route<T>(strings: TemplateStringsArray): RouterPattern<{}>;
export function route<T>(strings: TemplateStringsArray, ...parameters: T[]): RouterPattern<MergeParameters<T>>;
export function route(strings: TemplateStringsArray, ...parameters: {}[]): RouterPatternBase {
    return new RouterPatternImpl(strings, parameters);
}
