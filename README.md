# TV Explorer


TODO: Need to add nvmrc - node version 22 crypto.hash fails on node 18
[add bug report]()


TODO: Lets add es lint support

<!-- https://primevue.org/theming/unstyled/ -->
add architectural reasoning behind unstyled components

## Prime vue




## Vite config
add documentation entry for how to extend alias via vite config and make sure to include same details for tsconfig.app.json

```json
 {
    "resolve" : {
    "alias" : {
       '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@api': path.resolve(__dirname, 'src/api'),
    }
  }
 }
 ```


## Tokens
TODO : Add documentation entry for tokens and why we keep them in public
