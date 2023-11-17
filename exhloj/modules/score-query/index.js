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