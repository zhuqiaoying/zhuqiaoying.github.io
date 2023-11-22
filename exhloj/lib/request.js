function send_request(method, url, headers, data) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            headers,
            data: new URLSearchParams(Object.entries(data)).toString(),
            onload: resolve,
            onerror: reject,
        })
    })
}

function send_post(url, data) {
    return send_request('POST', url, {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }, data)
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