import { createMvcServer, hostUntilPressingEnter, indexViewCallback, registerBinaryFile, registerTextFile } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

const router = createRouter<[string, string | Buffer]>();

const distFolder = path.join(__dirname, `./dist`);
registerBinaryFile(router, 'image/x-icon', '/favicon.ico', distFolder);
registerBinaryFile(router, 'image/gif', '/logo.gif', distFolder);
registerTextFile(router, 'text/css', '/global.css', distFolder);
registerTextFile(router, 'text/css', '/navigation.css', distFolder);
for (const view of views) {
    registerTextFile(router, 'application/javascript', view.path, distFolder);
}

router.register([], route`/`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/index.html`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/tutorial.html`, indexViewCallback(views, 'Gaclib-TutorialView'));
router.register([], route`/demo.html`, indexViewCallback(views, 'Gaclib-DemoView'));
router.register([], route`/download.html`, indexViewCallback(views, 'Gaclib-DownloadView'));
router.register([], route`/document.html`, indexViewCallback(views, 'Gaclib-DocumentView'));
router.register([], route`/contact.html`, indexViewCallback(views, 'Gaclib-ContactView'));

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
