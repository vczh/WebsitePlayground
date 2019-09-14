import { ViewMetadata } from 'gaclib-render';
import * as path from 'path';
import { views } from './views';

const exportedArray = views.map((metadata: ViewMetadata) => {
    return {
        entry: metadata.source,
        output: {
            path: path.join(__dirname, `./dist${path.dirname(metadata.path)}`),
            filename: path.basename(metadata.path),
            library: metadata.name,
            libraryTarget: 'window',
            libraryExport: 'viewExport'
        },
        mode: 'production'
    };
});

module.exports = exportedArray;
