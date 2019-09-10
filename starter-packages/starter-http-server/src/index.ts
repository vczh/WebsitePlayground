import * as http from 'http';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Hello, you are querying: ${req.url}`);
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
