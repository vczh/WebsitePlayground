import * as http from 'http';
import * as querystring from 'querystring';
import * as url from 'url';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === undefined) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end();
    } else {
        const query = url.parse(req.url);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(`Hello, you are querying: ${JSON.stringify(query, undefined, 4)}\r\n`);
        if (typeof query.search === 'string') {
            res.write(`With arguments: ${JSON.stringify(querystring.parse(query.search.substr(1)), undefined, 4)}\r\n`);
        }
        res.end();
    }
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
