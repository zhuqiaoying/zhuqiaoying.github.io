import { serve } from "https://deno.land/std@0.207.0/http/server.ts"
import queryScore from "./modules/score-query/index.ts"

function matchPage(method, route, request) {
    return request.method == method && new URLPattern({ pathname: route }).exec(request.url)
}

serve(async (request) => {
    if (matchPage('POST', '/api/score-query', request))
        return await queryScore(request)
    return new Response(
        "Not found",
        { status: 404 },
    )
})