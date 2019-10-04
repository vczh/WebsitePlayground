import { readFileSync } from 'fs';
import { Article, parseArticle } from 'gaclib-article';
import { createMvcServer, hostUntilPressingEnter, litHtmlViewCallback, registerFolder } from 'gaclib-host';
import { createRouter, route } from 'gaclib-mvc';
import * as path from 'path';
import { views } from './views';

function loadArticle(filename: string): Article {
    const xml = readFileSync(path.join(__dirname, `../src/articles/${filename}`), { encoding: 'utf-8' });
    return parseArticle(xml);
}

const router = createRouter<[string, string | Buffer]>();
registerFolder(router, path.join(__dirname, `./dist`));

router.register(
    [],
    route`/`,
    litHtmlViewCallback(
        views,
        'Gaclib-IndexView',
        {
            embeddedResources: {
                activeButton: 'Home',
                article: loadArticle('home.xml')
            }
        }
    )
);

router.register(
    [],
    route`/index.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-IndexView',
        {
            embeddedResources: {
                activeButton: 'Home',
                article: loadArticle('home.xml')
            }
        }
    )
);

router.register(
    [],
    route`/tutorial.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-TutorialView',
        {
            embeddedResources: {
                activeButton: 'Tutorial',
                article: loadArticle('tutorial.xml')
            }
        }
    )
);

router.register(
    [],
    route`/demo.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DemoView',
        {
            embeddedResources: {
                activeButton: 'Demo',
                article: loadArticle('demo.xml')
            }
        }
    )
);

router.register(
    [],
    route`/download.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DownloadView',
        {
            embeddedResources: {
                activeButton: 'Download',
                article: loadArticle('download.xml')
            }
        }
    )
);

router.register(
    [],
    route`/document.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-DocumentView',
        {
            embeddedResources: {
                activeButton: 'Document',
                article: loadArticle('document.xml')
            }
        }
    )
);

router.register(
    [],
    route`/contact.html`,
    litHtmlViewCallback(
        views,
        'Gaclib-ContactView',
        {
            embeddedResources: {
                activeButton: 'Contact',
                article: loadArticle('contact.xml')
            }
        }
    )
);

const server = createMvcServer(router);
hostUntilPressingEnter(server, 8080);
