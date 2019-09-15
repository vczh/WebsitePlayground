import * as fs from 'fs';
import { createMvcServer, hostUntilPressingEnter, indexViewCallback, registerBinaryFile, registerTextFile } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as mime from 'mime-types';
import * as path from 'path';
import { views } from './views';

const router = createRouter<[string, string | Buffer]>();

function registerDist(distFolder: string, prefix: string): void {
    const currentFolder = path.join(distFolder, prefix.substr(1));
    for (const filename of fs.readdirSync(currentFolder)) {
        const childFolder = path.join(currentFolder, filename);
        if (fs.statSync(childFolder).isDirectory()) {
            registerDist(distFolder, `${prefix}${filename}/`);
        } else {
            const urlPath = `${prefix}${filename}`;
            const mimeType = mime.lookup(urlPath);
            if (mimeType !== false) {
                if (mimeType.substr(0, 6) === 'image/') {
                    registerBinaryFile(router, mimeType, urlPath, distFolder);
                } else {
                    registerTextFile(router, mimeType, urlPath, distFolder);
                }
            }
        }
    }
}

registerDist(path.join(__dirname, `./dist`), '/');

router.register([], route`/`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/index.html`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/tutorial.html`, indexViewCallback(views, 'Gaclib-TutorialView'));
router.register([], route`/demo.html`, indexViewCallback(views, 'Gaclib-DemoView'));
router.register([], route`/download.html`, indexViewCallback(views, 'Gaclib-DownloadView'));
router.register([], route`/document.html`, indexViewCallback(views, 'Gaclib-DocumentView'));
router.register([], route`/contact.html`, indexViewCallback(views, 'Gaclib-ContactView'));

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
