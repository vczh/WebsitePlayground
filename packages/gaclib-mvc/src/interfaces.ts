export type RouterParameterTypes =
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

export enum RouterFragmentKind {
    Text,
    Free,
    Head,
    Tail,
    HeadTail,
    MultiplePatterns
}

export enum RouterParameterKind {
    String,
    Number,
    Boolean
}

export type RouterParameter = [string, RouterParameterKind];

export type RouterFragment =
    | {
        kind: RouterFragmentKind.Text;
        text: string;
    }
    | {
        kind: RouterFragmentKind.Free;
        parameter: RouterParameter;
    }
    | {
        kind: RouterFragmentKind.Head;
        head: string;
        parameter: RouterParameter;
    }
    | {
        kind: RouterFragmentKind.Tail;
        tail: string;
        parameter: RouterParameter;
    }
    | {
        kind: RouterFragmentKind.HeadTail;
        head: string;
        tail: string;
        parameter: RouterParameter;
    }
    | {
        kind: RouterFragmentKind.MultiplePatterns;
        pattern: string;
        parameters: RouterParameter[];
        cachedRegExp?: RegExp;
    };

export interface RouterPatternBase {
    readonly fragments: RouterFragment[];
    createDefaultValue(): {};
    walk(text: string, fragment: RouterFragment, value: {}): boolean;
}

export interface RouterPattern<T> extends RouterPatternBase {
    createDefaultValue(): T;
    walk(text: string, fragment: RouterFragment, value: T): boolean;
}

export type RouterCallback<TModel, TResult> = (method: HttpMethods, model: TModel) => TResult;

export interface Router<TResult> {
    readonly registered: readonly RouterPatternBase[];
    register<TModel>(methods: HttpMethods[], pattern: RouterPattern<TModel>, callback: RouterCallback<TModel, TResult>): void;
    match(method: HttpMethods, query: string): TResult | undefined;
}
