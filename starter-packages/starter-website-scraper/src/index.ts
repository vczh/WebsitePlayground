import * as path from 'path';
import scrape = require('website-scraper');

const options = {
    urls: ['http://127.0.0.1:8080/index.html'],
    directory: path.join(__dirname, './dist'),
    recursive: true
};

scrape(options).then(
    (value: scrape.Resource[]) => {
        for (const res of value) {
            console.log(`${res.url} => ${res.filename}`);
        }
    },
    () => {/* empty */ }
);
