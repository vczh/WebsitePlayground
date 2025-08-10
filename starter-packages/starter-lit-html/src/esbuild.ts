import { build } from 'esbuild';
import * as path from 'path';

async function buildViews(inputPath: string, outputPath: string) {
    try {
        const fileName = path.basename(inputPath);
        const variableName = path.basename(inputPath, '.js');
        await build({
            entryPoints: [path.resolve(inputPath)],
            bundle: true,
            minify: true,
            format: 'iife',
            globalName: variableName,
            outfile: path.resolve(outputPath, fileName),
            platform: 'browser',
            target: 'es2022',
            footer: {
                js: `window['${variableName}'] = ${variableName}.esbuildExports;`
            }
        });
        console.log(`✓ Built ${inputPath}`);
    } catch (error) {
        console.error(`✗ Failed to build ${inputPath}:`, error);
        throw error;
    }
}

await buildViews('./lib/indexView.js', './lib/dist/scripts');
