import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { ensureDirSync } from 'fs-extra'
import { getModule } from './module'

let scripts: string[] = []
const modules: string[] = readdirSync('modules')

function applyScript(script: string) {
    scripts.push(readFileSync(script).toString())
}

applyScript('lib/header.js')
applyScript('lib/plugin.js')

for (let module of modules) {
    const { version, description, styleFiles, indexFiles } = getModule(module)
    scripts.push([
        `definePlugin(`,
        `    '${module}',`,
        `    '${description}',`,
        `    '${version}',`,
        `    () => {},`,
        `)`,
    ].join('\n'))
    for (let styleFile of styleFiles) {
        scripts.push([
            `atPlugin(`,
            `    '${module}',`,
            `    () => {`,
            `        GM_addStyle(\`${readFileSync(`modules/${module}/${styleFile}`)}\`)`,
            `    }`,
            `)`,
        ].join('\n'))
    }
    for (let indexFile of indexFiles) {
        applyScript(`modules/${module}/${indexFile}`)
    }
}

scripts.push('work()')

ensureDirSync('dist')
writeFileSync(`dist/exhloj-${getModule('core').version}.user.js`, scripts.join('\n\n'))