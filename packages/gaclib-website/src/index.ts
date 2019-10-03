import { createMvcServer, hostUntilPressingEnter, litHtmlViewCallback, registerFolder } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

const router = createRouter<[string, string | Buffer]>();
registerFolder(router, path.join(__dirname, `./dist`));
router.register([], route`/`, litHtmlViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/index.html`, litHtmlViewCallback(views, 'Gaclib-IndexView'));
router.register([], route`/tutorial.html`, litHtmlViewCallback(views, 'Gaclib-TutorialView'));
router.register([], route`/demo.html`, litHtmlViewCallback(views, 'Gaclib-DemoView'));
router.register([], route`/download.html`, litHtmlViewCallback(views, 'Gaclib-DownloadView'));
router.register([], route`/document.html`, litHtmlViewCallback(views, 'Gaclib-DocumentView'));
router.register([], route`/contact.html`, litHtmlViewCallback(views, 'Gaclib-ContactView'));

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
