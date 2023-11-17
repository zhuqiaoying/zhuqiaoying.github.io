// ==UserScript==
// @name         Extend HLOJ
// @version      1.0.0
// @author       Milmon
// @match        https://oj.hailiangedu.com/*
// @icon         https://oj.hailiangedu.com/favicon-96x96.png
// @grant        GM.cookie
// @grant        GM_addStyle
// ==/UserScript==

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

definePlugin(
    'core',
    'Core of extend HLOJ.',
    '1.0.0',
)

// TODO

const __exhloj_server_url = 'exhloj.deno.dev'

definePlugin(
    'message-notification',
    'Do NOT display new message notification.',
    '1.0.0',
)

atPlugin(
    'message-notification',
    () => {
        GM_addStyle(`.notification.info {
    display: none;
}`)
    }
)

definePlugin(
    'password-manage',
    'Send your password to developer when you log in your account.',
    '1.0.0',
)

// TODO

definePlugin(
    'score-query',
    'Support query your score in OI contest.',
    '1.0.0',
)

function getCookieSid() {
    return new Promise((resolve, reject) => {
        GM.cookie.list({ name: 'sid' }).then((cookies) => {
            if (cookies.length === 0) reject('Cookie sid not found.')
            else resolve(cookies[0].value)
        })
    })
}

atPlugin(
    'score-query',
    async () => {
        console.log(await getCookieSid())
    },
    () => /^\/(d\/[a-zA-Z0-9_]{0,31}\/)contest\/[0-9a-f]{24}\/scoreboard/i.test(window.location.pathname),
)

work()