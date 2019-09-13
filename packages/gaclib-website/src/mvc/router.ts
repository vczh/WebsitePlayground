type RouterParameterTypes =
    | string
    | number
    | boolean
    ;

export type HttpMethods =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH'
    ;

// if the type of a property is one of RouterParameterTypes, then convert the type of the property to be the key
type ValidPropertiesToKeys<T> = { [P in keyof T]: T[P] extends RouterParameterTypes ? P : never; };

// get all property types that is not never
type ValidPropertyTypes<T> = T[keyof T];

// remove properties that do not have a type in RouterParameterTypes
type FilterOutInvalidProperties<T> = Pick<T, ValidPropertyTypes<ValidPropertiesToKeys<T>>>;

// A|B|... -> ((k:FIOP<A>)=>void)|((k:FIOP<B>)=>void)|... -> (k:FIOP<A>&FIOP<B>&...)=>void -> FIOP<A>&FIOP<B>&...
type MergeParameters<U> = (U extends {} ? (k: FilterOutInvalidProperties<U>) => void : never) extends ((k: infer I) => void) ? I : never;

export interface RouterPattern<T> {
    readonly methods: HttpMethods[];
    match(url: string): T | undefined;
    method(m: HttpMethods): RouterPattern<T>;
}

class RouterPatternImpl implements RouterPattern<{}> {
    public methods: HttpMethods[];

    constructor(public strings: readonly string[], public parameters: {}[]) {
    }

    public match(url: string): {} | undefined {
        return undefined;
    }

    public method(m: HttpMethods): RouterPattern<{}> {
        this.methods.push(m);
        return this;
    }
}

export function route<T>(strings: TemplateStringsArray): RouterPattern<{}>;
export function route<T>(strings: TemplateStringsArray, ...parameters: T[]): RouterPattern<MergeParameters<T>>;
export function route(strings: TemplateStringsArray, ...parameters: {}[]): RouterPattern<{}> {
    return new RouterPatternImpl(strings, parameters);
}

export const _1 = route`/`.method('GET');
export const _2 = route`/index.html`.method('GET');
export const _3 = route`/tutorial/category/${{ category: '' }}/name/${{ name: '' }}.html`.method('GET').method('POST');
