// why @types/escape-string-regexp doesn't work?
const escapeStringRegexp = <(str: string) => string>require('escape-string-regexp');
import { RouterFragment, RouterFragmentKind, RouterParameter, RouterParameterKind, RouterParameterTypes, RouterPattern, RouterPatternBase } from './interfaces';

// if the type of a property is one of RouterParameterTypes, then convert the type of the property to be the key
type ValidPropertiesToKeys<T> = { [P in keyof T]: T[P] extends RouterParameterTypes ? P : never; };

// get all property types that is not never
type ValidPropertyTypes<T> = T[keyof T];

// remove properties that do not have a type in RouterParameterTypes
type FilterOutInvalidProperties<T> = Pick<T, ValidPropertyTypes<ValidPropertiesToKeys<T>>>;

// A|B|... -> ((k:FIOP<A>)=>void)|((k:FIOP<B>)=>void)|... -> (k:FIOP<A>&FIOP<B>&...)=>void -> FIOP<A>&FIOP<B>&...
type MergeParameters<U> = (U extends {} ? (k: FilterOutInvalidProperties<U>) => void : never) extends ((k: infer I) => void) ? I : never;

function getParameterName(fragment: {}): [true, RouterParameter] | [false, string] {
    if (typeof fragment === 'string') {
        return [false, fragment];
    }

    const keys = Object.keys(fragment);
    if (keys.length === 1) {
        switch (typeof fragment[keys[0]]) {
            case 'string':
                return [true, [keys[0], RouterParameterKind.String]];
            case 'number':
                return [true, [keys[0], RouterParameterKind.Number]];
            case 'boolean': {
                return [true, [keys[0], RouterParameterKind.Boolean]];
            }
            default:
                throw new Error(`The property of the parameter object "${JSON.stringify(fragment)}" can only be string, number or boolean.`);
        }
    }
    throw new Error(`Parameter object "${JSON.stringify(fragment)}" should have exactly one property.`);
}

function addParameter(value: {}, parameter: RouterParameter): void {
    switch (parameter[1]) {
        case RouterParameterKind.String:
            value[parameter[0]] = '';
            break;
        case RouterParameterKind.Number:
            value[parameter[0]] = 0;
            break;
        case RouterParameterKind.Boolean:
            value[parameter[0]] = false;
            break;
        default:
    }
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
                ;
            for (let j = 0; j < fragments.length; j++) {
                if (j > 0) {
                    this.submitFragment(fragmentBuilders);
                    fragmentBuilders = [];
                }

                if (fragments[j] !== '') {
                    fragmentBuilders.push(fragments[j]);
                }
            }

            if (i < parameters.length) {
                fragmentBuilders.push(parameters[i]);
            }
        }
        this.submitFragment(fragmentBuilders);
    }

    public createDefaultValue(): {} {
        const value = {};
        for (const fragment of this.fragments) {
            switch (fragment.kind) {
                case RouterFragmentKind.Free:
                case RouterFragmentKind.Head:
                case RouterFragmentKind.Tail:
                case RouterFragmentKind.HeadTail:
                    addParameter(value, fragment.parameter);
                    break;
                case RouterFragmentKind.MultiplePatterns:
                    for (const parameter of fragment.parameters) {
                        addParameter(value, parameter);
                    }
                    break;
                default:
            }
        }
        return value;
    }

    public walk(text: string, fragment: RouterFragment, value: {}): boolean {
        throw new Error('Not Implemented');
    }

    private submitFragment(fragmentBuilders: {}[]): void {
        const processedFragments = fragmentBuilders.map(getParameterName);
        switch (processedFragments.length) {
            case 0: {
                if (this.fragments.length !== 0) {
                    throw new Error('Empty pattern is not allowed between "/"s.');
                }
                this.fragments.push({
                    kind: RouterFragmentKind.Text,
                    text: ''
                });
                return;
            }
            case 1: {
                const arg1 = processedFragments[0];
                if (arg1[0]) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Free,
                        parameter: arg1[1]
                    });
                    return;
                } else {
                    this.fragments.push({
                        kind: RouterFragmentKind.Text,
                        text: arg1[1]
                    });
                    return;
                }
            }
            case 2: {
                const arg1 = processedFragments[0];
                const arg2 = processedFragments[1];
                if (!arg1[0] && arg2[0]) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Head,
                        head: arg1[1],
                        parameter: arg2[1]
                    });
                    return;
                } else if (arg1[0] && !arg2[0]) {
                    this.fragments.push({
                        kind: RouterFragmentKind.Tail,
                        tail: arg2[1],
                        parameter: arg1[1]
                    });
                    return;
                }
            }
            case 3: {
                const arg1 = processedFragments[0];
                const arg2 = processedFragments[1];
                const arg3 = processedFragments[2];
                if (!arg1[0] && arg2[0] && !arg3[0]) {
                    this.fragments.push({
                        kind: RouterFragmentKind.HeadTail,
                        head: arg1[1],
                        tail: arg3[1],
                        parameter: arg2[1]
                    });
                    return;
                }
            }
            default:
        }

        let pattern = '';
        const parameters: RouterParameter[] = [];
        let lastType: 0 | 1 | 2 = 0;

        for (const fragment of processedFragments) {
            if (fragment[0]) {
                if (lastType === 1) {
                    throw new Error('A non-empty text pattern is required between parameters.');
                }
                lastType = 1;
                pattern += '(.+)';
                parameters.push(fragment[1]);
            } else if (fragment[1] !== '') {
                lastType = 2;
                pattern += escapeStringRegexp(fragment[1]);
            }
        }
        this.fragments.push({
            kind: RouterFragmentKind.MultiplePatterns,
            pattern: `^${pattern}$`,
            parameters
        });
    }
}

export function route<T>(strings: TemplateStringsArray): RouterPattern<{}>;
export function route<T>(strings: TemplateStringsArray, ...parameters: T[]): RouterPattern<MergeParameters<T>>;
export function route(strings: TemplateStringsArray, ...parameters: {}[]): RouterPatternBase {
    return new RouterPatternImpl(strings, parameters);
}
