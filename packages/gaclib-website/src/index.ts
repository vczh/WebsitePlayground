import { createMvcServer, hostUntilPressingEnter, litHtmlViewCallback, registerFolder } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

const router = createRouter<[string, string | Buffer]>();
registerFolder(router, path.join(__dirname, `./dist`));

router.register(
    [],
    route`/`,
    litHtmlViewCallback(
        views,
        'Gaclib-IndexView',
        { embeddedResources: { activeButton: 'Home' } }
    )
);

router.register(
    [],
    route`/index.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-IndexView',
        { embeddedResources: { activeButton: 'Home' } }
    )
);

router.register(
    [],
    route`/tutorial.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-TutorialView',
        { embeddedResources: { activeButton: 'Tutorial' } }
    )
);

router.register(
    [],
    route`/demo.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DemoView',
        { embeddedResources: { activeButton: 'Demo' } }
    )
);

router.register(
    [],
    route`/download.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DownloadView',
        { embeddedResources: { activeButton: 'Download' } }
    )
);

router.register(
    [],
    route`/document.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DocumentView',
        { embeddedResources: { activeButton: 'Document' } }
    )
);

router.register(
    [],
    route`/contact.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-ContactView',
        { embeddedResources: { activeButton: 'Contact' } }
    )
);

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
