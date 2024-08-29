import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  rootDir: '.',
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
