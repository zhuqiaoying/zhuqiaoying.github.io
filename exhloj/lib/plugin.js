let __exhloj_packages = {}

function definePlugin(
    name, description, version,
) {
    if (__exhloj_packages[name]) return
    __exhloj_packages[name] = {
        name,
        version,
        description,
        register: [],
        match: [],
    }
}

function atPlugin(
    name, register, match = () => true,
) {
    if (!__exhloj_packages[name]) return
    __exhloj_packages[name].register.push(register)
    __exhloj_packages[name].match.push(match)
}

function mustMatch(name, match) {
    if (!__exhloj_packages[name]) return
    __exhloj_packages[name].match.push(match)
}

function work() {
    for (let [, pack] of Object.entries(__exhloj_packages)) {
        if (pack.match.every(func => func())) {
            for (let register of pack.register) register()
        }
    }
}