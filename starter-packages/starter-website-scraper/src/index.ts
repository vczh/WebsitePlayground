import * as path from 'path';
import scrape = require('website-scraper');

type RegisterAction = (
    action: 'generateFilename',
    callback: (value: { resource: scrape.Resource }) => { filename: string }
) => void;

const options = {
    urls: ['http://127.0.0.1:8080/index.html'],
    directory: path.join(__dirname, './dist'),
    // filenameGenerator: 'bySiteStructure',
    recursive: true,
    plugins: [{
        apply(registerAction: RegisterAction): void {
            registerAction('generateFilename', (value: { resource: scrape.Resource }) => {
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

scrape(options).then(
    (value: scrape.Resource[]) => {
        for (const res of value) {
            console.log(`${res.url} => ${res.filename}`);
        }
    },
    (err: Error) => { console.log(err.message); }
);
