const path = require('path');

function exposeNamespaceInFile(inputPath, outputPath) {
    /*
    The TypeScript file before compiling should looks like this:

    XXX.ts
    export namespace XXX {
        export ...;
    }

    So that after <script src="/scripts/indexView.js"></script>,
    namespace XXX could be used directly.
    */

    const fileName = path.basename(inputPath);
    const namespaceName = path.basename(inputPath, '.js');
    return {
        entry: inputPath,
        output: {
            path: path.resolve(__dirname, outputPath),
            filename: fileName,
            library: namespaceName,
            libraryTarget: 'window',
            libraryExport: namespaceName
        },
        mode: 'production'
    };
}

module.exports = [
    exposeNamespaceInFile('./lib/raw/scripts/indexView.js', 'lib/dist/scripts')
];
