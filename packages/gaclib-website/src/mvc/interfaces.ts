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

export type RouterFragment =
    | {
        kind: RouterFragmentKind.Text;
        text: string;
    }
    | {
        kind: RouterFragmentKind.Free;
        name: string;
    }
    | {
        kind: RouterFragmentKind.Head;
        head: string;
        name: string;
    }
    | {
        kind: RouterFragmentKind.Tail;
        tail: string;
        name: string;
    }
    | {
        kind: RouterFragmentKind.HeadTail;
        head: string;
        tail: string;
        name: string;
    }
    | {
        kind: RouterFragmentKind.MultiplePatterns;
        pattern: string;
        names: string[];
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

export type RouterCallback<T> = (parameters: T) => {};

export interface Router {
    register<T>(methods: HttpMethods[], pattern: RouterPattern<T>, callback: RouterCallback<T>): void;
    match(text: string): {};
}
