import * as path from 'path';
import { ViewMetadata } from './interfaces';
import { metadata as indexView } from './views/indexView/Metadata';

const exportedArray = [indexView].map((metadata: ViewMetadata) => {
    return {
        entry: indexView.source,
        output: {
            path: path.join(__dirname, `./dist${path.dirname(indexView.path)}`),
            filename: path.basename(indexView.path),
            library: indexView.name,
            libraryTarget: 'window',
            libraryExport: 'viewExport'
        },
        mode: 'production'
    };
});

module.exports = exportedArray;
