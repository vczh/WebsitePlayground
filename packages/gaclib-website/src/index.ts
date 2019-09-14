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

router.register([], route`/${{ title: '' }}.html`, indexViewCallback(views, 'Gaclib-IndexView'));

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
