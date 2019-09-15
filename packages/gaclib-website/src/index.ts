import { createMvcServer, hostUntilPressingEnter, indexViewCallback, registerFolder } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

const router = createRouter<[string, string | Buffer]>();
registerFolder(router, path.join(__dirname, `./dist`));
router.register([], route`/`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/index.html`, indexViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/tutorial.html`, indexViewCallback(views, 'Gaclib-TutorialView'));
router.register([], route`/demo.html`, indexViewCallback(views, 'Gaclib-DemoView'));
router.register([], route`/download.html`, indexViewCallback(views, 'Gaclib-DownloadView'));
router.register([], route`/document.html`, indexViewCallback(views, 'Gaclib-DocumentView'));
router.register([], route`/contact.html`, indexViewCallback(views, 'Gaclib-ContactView'));

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
