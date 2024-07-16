import {defineConfig} from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'apollo-hooks',
      fileName: format => `apollo-hooks.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', '@apollo/client', 'graphql'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          '@apollo/client': 'ApolloClient',
          graphql: 'GraphQL',
        },
      },
    },
  },
  plugins: [],
  resolve: {
    alias: {
      '@': './src',
    },
  },
})
