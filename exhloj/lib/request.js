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
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }, data)
}

function send_get(url, data) {
    return send_request('GET', url, {}, {})
}