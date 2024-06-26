import vueJsx from '@vitejs/plugin-vue-jsx'

import { viteConfigFactory } from '../../vite.config'

export default viteConfigFactory(import.meta.url, {
  plugins: [vueJsx()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
