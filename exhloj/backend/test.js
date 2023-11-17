await fetch('/api/score-query', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
        url: 'https://oj.hailiangedu.com',
        username: 'liujiameng',
        cookie: 'sid=',
        domain: 'pnoi',
        contestId: 'abde',
        pid: '1',
    }),
});