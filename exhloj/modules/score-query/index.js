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
            pid: pdoc.docId,
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