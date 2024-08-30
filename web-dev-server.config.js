import { esbuildPlugin } from '@web/dev-server-esbuild';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  rootDir: isProduction ? 'dist' : '.',
  nodeResolve: true,
  open: true,
  watch: true,
  plugins: [
    esbuildPlugin({ ts: true, target: 'auto' })
  ],
  appIndex: 'index.html',
  mimeTypes: {
    '**/*.ts': 'js'
  }
};