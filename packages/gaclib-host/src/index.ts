import { readFileSync } from 'fs';
import { HttpMethods, route, Router, RouterCallback } from 'gaclib-mvc';
import { generateHtml, HtmlInfo, ViewMetadata } from 'gaclib-render';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';

type MvcRouterResult = [string, string | Buffer];
type MvcRouter = Router<MvcRouterResult>;

export function indexViewCallback(views: ViewMetadata[], viewName: string, info: HtmlInfo = {}, head: string = '', body: string = ''): RouterCallback<{ title: string }, MvcRouterResult> {
    return (method: HttpMethods, model: { title: string }): [string, string] => {
        const generatedHtml = generateHtml(
            info,
            views,
            viewName,
            model,
            head,
            body
        );
        return ['text/html', generatedHtml];
    };
}

export function textFileCallback(type: string, filename: string): RouterCallback<{}, MvcRouterResult> {
    const buffer = readFileSync(filename, { encoding: 'utf-8' });
    return (): [string, string] => [type, buffer];
}

export function binaryFileCallback(type: string, filename: string): RouterCallback<{}, MvcRouterResult> {
    const buffer = readFileSync(filename);
    return (): [string, Buffer] => [type, buffer];
}

function registerFile(router: MvcRouter, type: string, resourcePath: string, dir: string, callback: (type: string, filename: string) => RouterCallback<{}, MvcRouterResult>): void {
    if (resourcePath.length === 0 || resourcePath[0] !== '/') {
        throw new Error('Path should begin with "/".');
    }

    const tsa: TemplateStringsArray = Object.assign([resourcePath], { raw: [resourcePath] });
    router.register([], route(tsa), callback(type, path.join(dir, `.${resourcePath}`)));
}

export function registerTextFile(router: MvcRouter, type: string, resourcePath: string, dir: string): void {
    registerFile(router, type, resourcePath, dir, textFileCallback);
}

export function registerBinaryFile(router: MvcRouter, type: string, resourcePath: string, dir: string): void {
    registerFile(router, type, resourcePath, dir, binaryFileCallback);
}

export function createMvcServer(router: MvcRouter): http.Server {
    return http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        NOT_FOUND: {
            if (req.method === undefined || req.url === undefined) {
                break NOT_FOUND;
            }

            const query = url.parse(req.url, true);
            if (query.pathname === undefined) {
                break NOT_FOUND;
            }

            const htmlResult = router.match(<HttpMethods>req.method, query.pathname);
            if (htmlResult === undefined) {
                break NOT_FOUND;
            }

            if (typeof htmlResult[1] === 'string') {
                res.writeHead(200, { 'Content-Type': htmlResult[0] });
                res.write(htmlResult[1]);
            } else {
                res.writeHead(200, { 'Content-Type': htmlResult[0] });
                res.write(htmlResult[1], 'binary');
            }
            res.end();
            return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Sorry, the server does not respond to your query.');
        res.end();
    });
}

export function hostUntilPressingEnter(server: http.Server, port: number, host: string = 'localhost'): void {
    server.listen(port, host, () => {
        console.log('Server started at port: 8080');
        console.log('Press ENTER to stop');
    });

    if (process.stdin.setRawMode !== undefined) {
        process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.on('data', () => { process.exit(0); });
}
