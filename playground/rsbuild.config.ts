import { defineConfig } from "@rsbuild/core"
import { pluginUserScript } from "../src"

export default defineConfig({
    plugins: [
        pluginUserScript({
            entry: "./src/index.js",
            name: "My User Script",
            author: "Me",
            version: "0.0.1",
            headerEntries: [
            "// @match https://*/*",
            ],
            description: "Replaces html body content",
        }),
    ],
    output: {
        minify: false,
    }
})
