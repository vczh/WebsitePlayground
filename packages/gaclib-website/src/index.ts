import { binaryFileCallback, createMvcServer, indexViewCallback, textFileCallback } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

const distFolder = path.join(__dirname, `./dist`);
const router = createRouter<[string, string | Buffer]>();
router.register([], route`/favicon.ico`, binaryFileCallback('image/x-icon', path.join(distFolder, './favicon.ico')));
router.register([], route`/global.css`, textFileCallback('text/css', path.join(distFolder, './global.css')));
router.register([], route`/scripts/indexView.js`, textFileCallback('application/javascript', path.join(distFolder, './scripts/indexView.js')));
router.register([], route`/${{ title: '' }}.html`, indexViewCallback(views, 'Gaclib-IndexView'));

const server = createMvcServer(router);

server.listen(8080, 'localhost', () => {
    console.log('Server started at port: 8080');
    console.log('Press ENTER to stop');
});

if (process.stdin.setRawMode !== undefined) {
    process.stdin.setRawMode(true);
}
process.stdin.resume();
process.stdin.on('data', () => { process.exit(0); });
