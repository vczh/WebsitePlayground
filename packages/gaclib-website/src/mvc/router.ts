import { RouterFragment, RouterParameterTypes, RouterPattern, RouterPatternBase } from './interfaces';

// if the type of a property is one of RouterParameterTypes, then convert the type of the property to be the key
type ValidPropertiesToKeys<T> = { [P in keyof T]: T[P] extends RouterParameterTypes ? P : never; };

// get all property types that is not never
type ValidPropertyTypes<T> = T[keyof T];

// remove properties that do not have a type in RouterParameterTypes
type FilterOutInvalidProperties<T> = Pick<T, ValidPropertyTypes<ValidPropertiesToKeys<T>>>;

// A|B|... -> ((k:FIOP<A>)=>void)|((k:FIOP<B>)=>void)|... -> (k:FIOP<A>&FIOP<B>&...)=>void -> FIOP<A>&FIOP<B>&...
type MergeParameters<U> = (U extends {} ? (k: FilterOutInvalidProperties<U>) => void : never) extends ((k: infer I) => void) ? I : never;

class RouterPatternImpl implements RouterPatternBase {
    public fragments: RouterFragment[];

    constructor(strings: TemplateStringsArray, parameters: {}[]) {
        throw new Error('Not Implemented');
    }

    public createDefaultValue(): {} {
        throw new Error('Not Implemented');
    }

    public walk(text: string, fragment: RouterFragment, value: {}): boolean {
        throw new Error('Not Implemented');
    }
}

export function route<T>(strings: TemplateStringsArray): RouterPattern<{}>;
export function route<T>(strings: TemplateStringsArray, ...parameters: T[]): RouterPattern<MergeParameters<T>>;
export function route(strings: TemplateStringsArray, ...parameters: {}[]): RouterPatternBase {
    return new RouterPatternImpl(strings, parameters);
}

export const _1 = route`/`;
export const _2 = route`/index.html`;
export const _3 = route`/tutorial/category/${{ category: '' }}/name/${{ name: '' }}.html`;
