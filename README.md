# rsbuild-user-script-plugin

## Usage

Install:

```bash
pnpm add rsbuild-user-script-plugin -D

yarn add rsbuild-user-script-plugin -D
```

Add the plugin to your `rsbuild.config.ts` and configure accordingly:

```ts
// rsbuild.config.ts
import {pluginExample} from "rsbuild-plugin-example";

export default defineConfig({
    plugins: [
        pluginUserScript({
            entry: "./src/index.js",
            name: "My User Script",
            author: "Me",
            version: "0.0.1",
            headerEntries: [
                // configure any headers you need
                "// @match https://*/*",
            ],
            description: "does something",
        }),
    ],
    output: {
        minify: false,
    }
})
```

## Development and Hot Reloading

The plugin also hooks into the `rsbuild` development server to allow for hot reloading of a dev build
or installing a build into your browser.
You need the following scripts that should come by default anyway:

```json
{
  "scripts": {
    "dev": "rsbuild dev",
    "preview": "rsbuild preview"
  }
}
```

You also need to configure Tampermonkey to always update externals. The hot reloading solution was taken
from [https://github.com/momocow/webpack-userscript](https://github.com/momocow/webpack-userscript?tab=readme-ov-file#integration-with-webpack-dev-server-and-tampermonkey).
Please take look there to setup Tampermonkey otherwise you'd have to manually update the script every time.

## PluginUserScriptOptions

Options for configuring `pluginUserScript`.

### Properties

- **entry** (required)
    - Type: `string`
    - Description: The entry file for the user script.

- **name** (required)
    - Type: `string`
    - Description: The name of the user script.

- **author** (required)
    - Type: `string`
    - Description: The author of the user script.

- **version** (required)
    - Type: `string`
    - Description: The version of the user script.

- **description** (required)
    - Type: `string`
    - Description: The description of the user script.

- **headerEntries** (optional)
    - Type: `string[]`
    - Default: `[]`
    - Description: Additional header entries for the user script.

- **createHeader** (optional)
    - Type: `(other: string[]) => string`
    - Default: see [./src/index.ts](./src/index.ts)
    - Description: A function to create the header for the user script.

- **createProxyHeader** (optional)
    - Type: `(serverPort: number, filename: string, other: string[]) => string`
    - Default: see [./src/index.ts](./src/index.ts)
    - Description: A function to create the proxy header for the user script.

## License

[MIT](./LICENSE).
