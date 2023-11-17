import { readFileSync, readdirSync } from 'node:fs'

export function getModule(name: string) {
    const json = JSON.parse(readFileSync(`modules/${name}/package.json`).toString())
    const files = readdirSync(`modules/${name}`)
    return {
        version: json.version,
        description: json.description,
        styleFiles: files.filter(file => file.endsWith('.css')),
        indexFiles: json.main.endsWith('.js') ? [json.main] : [],
    }
}