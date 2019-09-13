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
type MergeParameters<U> = (U extends any ? (k: FilterOutInvalidProperties<U>) => void : never) extends ((k: infer I) => void) ? I : never;

export interface RouterPattern<T, TMethod extends HttpMethods | undefined> {
    match(url: string): T;
}

export function route<T>(strings: TemplateStringsArray): RouterPattern<{}, 'GET'>;
export function route<T>(strings: TemplateStringsArray, ...values: T[]): RouterPattern<MergeParameters<T>, 'GET'>;
export function route(strings: TemplateStringsArray, ...values: {}[]): {} {
    return {
        match(url: string): undefined {
            return undefined;
        }
    };
}

export const _1 = route`/`;
export const _2 = route`/index.html`;
export const _3 = route`/tutorial/category/${{ category: '' }}/name/${{ name: '' }}.html`;
