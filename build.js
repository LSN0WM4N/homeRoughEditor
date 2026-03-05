import esbuild from 'esbuild';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const SCRIPTS = ['mousewheel.js', 'func.js', 'qSVG.js', 'editor.js', 'engine.js'];
const TEMP_FILE = '_combined_scripts.js';

const combined = (await Promise.all(
  SCRIPTS.map(async (f) => {
    const source = readFileSync(f, 'utf8');
    const result = await esbuild.transform(source, {
      minify: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      minifySyntax: true,
      legalComments: 'none',
    });
    return result.code;
  })
)).join('\n');

writeFileSync(TEMP_FILE, `export const combinedScripts = ${JSON.stringify(combined)};`);

await esbuild.build({
  entryPoints: ['editor-element.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  platform: 'browser',
  minify: true,
  minifyIdentifiers: true,
  minifyWhitespace: true,
  minifySyntax: true,
  legalComments: 'none',
  sourcemap: false,
}).catch(() => process.exit(1));

unlinkSync(TEMP_FILE);