// TODO

const __exhloj_server_url = 'https://exhloj.deno.dev'

window.page_url = window.location.pathname.startsWith('/d/')
    ? /^\/d\/[a-zA-Z0-9_]{0,31}(.*?)$/.exec(window.location.pathname)[1]
    : window.location.pathname

window.domainId = UiContext.domainId
window.user = UserContext