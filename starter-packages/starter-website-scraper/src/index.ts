import * as path from 'path';
import websiteScraper from 'website-scraper';

type RegisterAction = (
    action: 'generateFilename',
    callback: (value: { resource: websiteScraper.Resource }) => { filename: string }
) => void;

const options = {
    urls: ['http://localhost:8080/index.html'],
    directory: path.resolve('./lib/dist'),
    // filenameGenerator: 'bySiteStructure',
    recursive: true,
    plugins: [{
        apply(registerAction: RegisterAction): void {
            registerAction('generateFilename', (value: { resource: websiteScraper.Resource }) => {
                // eslint-disable-next-line no-useless-escape
                const matches = /^http:\/\/[^\/]+(.*)$/g.exec(value.resource.url);
                if (matches !== null) {
                    return { filename: matches[1] };
                } else {
                    throw new Error(`Unable to process url: ${value.resource.url}`);
                }
            });
        }
    }]
};

websiteScraper(options).then(
    (value: websiteScraper.Resource[]) => {
        for (const res of value) {
            console.log(`${res.url} => ${res.filename}`);
        }
    },
    (err: Error) => { console.log(err.message); }
);
