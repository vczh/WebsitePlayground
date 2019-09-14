import { readFileSync } from 'fs';
import { HttpMethods, Router } from 'gaclib-mvc';
import { generateHtml, HtmlInfo, ViewMetadata } from 'gaclib-render';
import * as http from 'http';
import * as url from 'url';

export function indexViewCallback(views: ViewMetadata[], viewName: string, info: HtmlInfo = {}, head: string = '', body: string = ''): (method: HttpMethods, model: { title: string }) => [string, string] {
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

export function textFileCallback(type: string, filename: string): () => [string, string] {
    const buffer = readFileSync(filename, { encoding: 'utf-8' });
    return (): [string, string] => [type, buffer];
}

export function binaryFileCallback(type: string, filename: string): () => [string, Buffer] {
    const buffer = readFileSync(filename);
    return (): [string, Buffer] => [type, buffer];
}

export function createMvcServer(router: Router<[string, string | Buffer]>): http.Server {
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
