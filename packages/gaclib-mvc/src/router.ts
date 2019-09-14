import { HttpMethods, Router, RouterCallback, RouterPattern, RouterPatternBase } from './interfaces';

interface RouterPackage<TResult> {
    methods: HttpMethods[];
    pattern: RouterPatternBase;
    callback(method: HttpMethods, model: {}): TResult;
}

class RouterImpl<TResult> implements Router<TResult> {
    private readonly patterns: RouterPackage<TResult>[] = [];

    public register<TModel>(methods: HttpMethods[], pattern: RouterPattern<TModel>, callback: RouterCallback<TModel, TResult>): void {
        this.patterns.push({
            methods: methods.length === 0 ? ['GET'] : methods,
            pattern,
            callback
        });
    }

    public match(method: HttpMethods, query: string): TResult | undefined {
        if (query[0] !== '/') {
            throw new Error('Query should begin with "/".');
        }

        const fragments = query.split('/');
        let result: TResult | undefined;

        PATTERN_LOOP: for (const pattern of this.patterns) {
            if (pattern.methods.indexOf(method) !== -1 && pattern.pattern.fragments.length === fragments.length - 1) {
                const rp = pattern.pattern;
                const model = rp.createDefaultValue();
                for (let i = 0; i < rp.fragments.length; i++) {
                    if (!rp.walk(fragments[i + 1], rp.fragments[i], model)) {
                        continue PATTERN_LOOP;
                    }
                }

                if (result === undefined) {
                    result = pattern.callback(method, model);
                } else {
                    throw new Error(`Multiple patterns match query: "${query}".`);
                }
            }
        }
        return result;
    }
}

export function createRouter<TResult>(): Router<TResult> {
    return new RouterImpl<TResult>();
}
