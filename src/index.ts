import fs from "node:fs"
import type { RsbuildPlugin } from "@rsbuild/core"
import open from "open"

export type PluginUserScriptOptions = {
    entry: string
    name: string
    author: string
    version: string
    description: string
    headerEntries?: string[]
    createHeader?: (other: string[]) => string
    createProxyHeader?: (serverPort: number, filename: string, other: string[]) => string
}

export const pluginUserScript = ({
    entry,
    name,
    author,
    version,
    description,
    headerEntries = [],
    createHeader = () => {
        return [
            "// ==UserScript==",
            `// @name         ${name}`,
            `// @author       ${author}`,
            `// @version      ${version}`,
            `// @description  ${description}`,
            ...headerEntries,
            "// ==/UserScript==",
        ].join("\n")
    },
    createProxyHeader = (serverPort, filename) => {
        return [
            "// ==UserScript==",
            `// @name         Proxy for ${name}`,
            "// @author       rsbuild:plugin-user-script",
            "// @version      0.0.0",
            "// @description  Development script that proxies to a dev build",
            ...headerEntries,
            `// @require      http://localhost:${serverPort}/user-script/${filename}`,
            "// ==/UserScript==",
        ].join("\n")
    },
}: PluginUserScriptOptions): RsbuildPlugin => ({
    name: "esbuild:plugin-user-script",
    async setup(api) {
        const filename = `${name.replace(/\s/g, "_")}.user.js`
        api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
            return mergeRsbuildConfig(config, {
                tools: {
                    htmlPlugin: false,
                },
                source: {
                    entry: {
                        entry,
                    },
                },
                output: {
                    injectStyles: true,
                    filenameHash: false,
                    filename: {
                        js: filename,
                    },
                    distPath: {
                        js: "user-script",
                    },
                    legalComments: "inline",
                },
                performance: {
                    chunkSplit: {
                        strategy: "all-in-one",
                    },
                },
                dev: {
                    writeToDisk: true,
                    hmr: false,
                    liveReload: true,
                },
                server: {
                    publicDir: {
                        name: "dist",
                        copyOnBuild: false,
                        watch: true,
                    },
                },
            })
        })

        api.onAfterBuild(() => {
            const config = api.getNormalizedConfig()
            const distRoot = config.output.distPath.root

            const scriptHeader = createHeader(headerEntries)
            const scriptContent = fs.readFileSync(`${distRoot}/user-script/${filename}`, "utf-8")
            fs.writeFileSync(`${distRoot}/user-script/${filename}`, `${scriptHeader}\n${scriptContent}`)
        })

        api.onAfterStartProdServer(() => {
            const config = api.getNormalizedConfig()
            open(`http://localhost:${config.server.port}/user-script/${filename}`)
        })

        api.onDevCompileDone((params) => {
            if (params.isFirstCompile) {
                const config = api.getNormalizedConfig()
                const distRoot = config.output.distPath.root
                const proxyScriptName = `proxy_${filename}`
                const proxyScriptHeader = createProxyHeader(config.server.port, filename, headerEntries)

                fs.writeFileSync(`${distRoot}/user-script/${proxyScriptName}`, proxyScriptHeader)
                open(`http://localhost:${config.server.port}/user-script/${proxyScriptName}`)
            }
        })
    },
})
