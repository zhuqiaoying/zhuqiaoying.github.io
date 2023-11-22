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
        const { rdoc, tdoc } = await send_hydro_get(`/d/${domainId}/record/${rid}`)
        if (rdoc.uid !== window.user._id && typeof rdoc.uid === 'number') return
        if (!tdoc || tdoc.rule !== 'oi' || rdoc.testCases) return
        console.log('test')
    },
    () => document.querySelector('html').getAttribute('data-page') === 'record_detail',
)