import { readFileSync } from 'fs';
import { createRouter, HttpMethods, route } from 'gaclib-mvc';
import { generateHtml, HtmlInfo, mergeHtmlInfo, views } from 'gaclib-views';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';

const indexView = views[0];

function indexViewCallback(method: HttpMethods, model: { title: string }): [string, string] {
    const viewHtmlInfo: HtmlInfo = {
        scripts: [indexView.path]
    };
    const head = '';
    const body = `
<script lang="javascript">
window["Gaclib-IndexView"].renderIndexView(window["Gaclib-Model"], document.body);
</script>
`;
    const generatedHtml = generateHtml(
        mergeHtmlInfo(indexView.htmlInfo, viewHtmlInfo),
        model,
        head,
        body
    );
    return ['text/html', generatedHtml];
}

function textFileCallback(type: string, filename: string): () => [string, string] {
    const buffer = readFileSync(filename, { encoding: 'utf-8' });
    return (): [string, string] => [type, buffer];
}

function binaryFileCallback(type: string, filename: string): () => [string, Buffer] {
    const buffer = readFileSync(filename);
    return (): [string, Buffer] => [type, buffer];
}

const distFolder = path.join(__dirname, `../../gaclib-views/lib/dist`);

const router = createRouter<[string, string | Buffer]>();
router.register([], route`/favicon.ico`, binaryFileCallback('image/x-icon', path.join(distFolder, './favicon.ico')));
router.register([], route`/global.css`, textFileCallback('text/css', path.join(distFolder, './global.css')));
router.register([], route`/scripts/indexView.js`, textFileCallback('application/javascript', path.join(distFolder, './scripts/indexView.js')));
router.register([], route`/${{ title: '' }}.html`, indexViewCallback);

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
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

server.listen(8080, 'localhost', () => {
    console.log('Server started at port: 8080');
    console.log('Press ENTER to stop');
});

if (process.stdin.setRawMode !== undefined) {
    process.stdin.setRawMode(true);
}
process.stdin.resume();
process.stdin.on('data', () => { process.exit(0); });
