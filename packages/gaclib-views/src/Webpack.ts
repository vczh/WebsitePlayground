import * as path from 'path';
import { ViewMetadata } from './interfaces';
import { metadata as indexView } from './scripts/indexView';

const exportedArray = [indexView].map((metadata: ViewMetadata) => {
    return {
        entry: indexView.source,
        output: {
            path: `./lib/dist${path.dirname(indexView.path)}`,
            fileame: path.basename(indexView.path),
            library: indexView.name,
            libraryTarget: 'window',
            libraryExport: 'viewExport'
        },
        mode: 'production'
    };
});

module.exports = exportedArray;
