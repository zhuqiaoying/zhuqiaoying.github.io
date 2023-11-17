import { serve } from "https://deno.land/std@0.207.0/http/server.ts"

function matchPage(method, route, request) {
    return request.method == method && new URLPattern({ pathname: route }).exec(request.url)
}

serve((request) => {
    if (matchPage('GET', '/api/score-query/query', request))
        return new Response(
            JSON.stringify({ a: 1 }),
            { headers: { "content-type": "application/json" } },
        )
    return new Response(
        "Not found",
        { status: 404 },
    )
})