// ==UserScript==
// @name         Extend HLOJ
// @version      1.0.0
// @author       Milmon
// @match        https://oj.hailiangedu.com/*
// @icon         https://oj.hailiangedu.com/favicon-96x96.png
// @grant        GM.cookie
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
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

function send_request(method, url, headers, data) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            headers,
            data,
            onload: resolve,
            onerror: reject,
        })
    })
}

function send_post(url, data) {
    return send_request('POST', url, {
        'content-type': 'application/json'
    }, JSON.stringify(data))
}

function send_get(url) {
    return send_request('GET', url, {}, {})
}

async function send_hydro_get(url) {
    return await (await fetch(url, {
        headers: { accept: 'application/json' },
        method: 'GET',
    })).json()
}

async function send_hydro_post(url, body) {
    return await(await fetch(url, {
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
    })).json()
}

definePlugin(
    'core',
    'Core of extend HLOJ.',
    '1.0.0',
)

// TODO

const __exhloj_server_url = 'https://exhloj.deno.dev'

window.page_url = window.location.pathname.startsWith('/d/')
    ? /^\/d\/[a-zA-Z0-9_]{0,31}(.*?)$/.exec(window.location.pathname)[1]
    : window.location.pathname

window.domainId = UiContext.domainId
window.user = UserContext

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
            else resolve(`sid=${cookies[0].value}`)
        })
    })
}

atPlugin(
    'score-query',
    async () => {
        const cookie = await getCookieSid()
        const rid = /^\/record\/([0-9a-f]{24})/i.exec(window.page_url)[1]
        const { rdoc, tdoc, pdoc } = await send_hydro_get(`/d/${window.domainId}/record/${rid}`)
        if (rdoc.uid !== window.user._id && typeof rdoc.uid === 'number') return
        if (!tdoc || tdoc.rule !== 'oi' || rdoc.testCases) return
        const { response } = await send_post(`${__exhloj_server_url}/api/score-query`, {
            url: window.location.origin,
            username: window.user.uname,
            cookie,
            domain: window.domainId,
            contestId: tdoc._id,
            pid: `${pdoc.docId}`,
        })
        const result = JSON.parse(response)
        if (result.error) {
            console.error('[exhloj] module/score-query: Error at getting score.')
            return
        }
        console.log(result)
    },
    () => document.querySelector('html').getAttribute('data-page') === 'record_detail',
)

work()