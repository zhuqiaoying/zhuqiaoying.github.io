import superagent from 'npm:superagent@8.1.2'
import { writeFileSync } from 'node:fs'

export enum STATUS {
    STATUS_WAITING = 0,
    STATUS_ACCEPTED = 1,
    STATUS_WRONG_ANSWER = 2,
    STATUS_TIME_LIMIT_EXCEEDED = 3,
    STATUS_MEMORY_LIMIT_EXCEEDED = 4,
    STATUS_OUTPUT_LIMIT_EXCEEDED = 5,
    STATUS_RUNTIME_ERROR = 6,
    STATUS_COMPILE_ERROR = 7,
    STATUS_SYSTEM_ERROR = 8,
    STATUS_CANCELED = 9,
    STATUS_ETC = 10,
    STATUS_HACKED = 11,
    STATUS_JUDGING = 20,
    STATUS_COMPILING = 21,
    STATUS_FETCHED = 22,
    STATUS_IGNORED = 30,
    STATUS_FORMAT_ERROR = 31,
    STATUS_HACK_SUCCESSFUL = 32,
    STATUS_HACK_UNSUCCESSFUL = 33,
}

export const STATUS_TEXTS: Record<STATUS, string> = {
    [STATUS.STATUS_WAITING]: 'Waiting',
    [STATUS.STATUS_ACCEPTED]: 'Accepted',
    [STATUS.STATUS_WRONG_ANSWER]: 'Wrong Answer',
    [STATUS.STATUS_TIME_LIMIT_EXCEEDED]: 'Time Exceeded',
    [STATUS.STATUS_MEMORY_LIMIT_EXCEEDED]: 'Memory Exceeded',
    [STATUS.STATUS_OUTPUT_LIMIT_EXCEEDED]: 'Output Exceeded',
    [STATUS.STATUS_RUNTIME_ERROR]: 'Runtime Error',
    [STATUS.STATUS_COMPILE_ERROR]: 'Compile Error',
    [STATUS.STATUS_SYSTEM_ERROR]: 'System Error',
    [STATUS.STATUS_CANCELED]: 'Cancelled',
    [STATUS.STATUS_ETC]: 'Unknown Error',
    [STATUS.STATUS_HACKED]: 'Hacked',
    [STATUS.STATUS_JUDGING]: 'Running',
    [STATUS.STATUS_COMPILING]: 'Compiling',
    [STATUS.STATUS_FETCHED]: 'Fetched',
    [STATUS.STATUS_IGNORED]: 'Ignored',
    [STATUS.STATUS_FORMAT_ERROR]: 'Format Error',
    [STATUS.STATUS_HACK_SUCCESSFUL]: 'Hack Successful',
    [STATUS.STATUS_HACK_UNSUCCESSFUL]: 'Hack Unsuccessful',
}

class Service {
    public logs: string[] = [];
    constructor(
        public endPoint: string,
        public username: string,
        public cookie: string,
        public domainId: string,
    ) { }
    get(url: string) {
        return superagent
            .get(this.endPoint + '/d/' + this.domainId + url)
            .set('Cookie', this.cookie)
            .accept('application/json')
    }
    post(url: string) {
        return superagent
            .post(this.endPoint + '/d/' + this.domainId + url)
            .set('Cookie', this.cookie)
            .accept('application/json')
    }
    log(content: string) { this.logs.push(content) }

    async checkLoggedIn(): Promise<boolean> {
        const { body: { UserContext } } = await this.get(`/`)
        const json = JSON.parse(UserContext)
        return json?.uname === this.username
    }
    async getContest(contestId: string) {
        const { body } = await this.get(`/contest/${contestId}`)
        const { tdoc } = body
        this.log(`Contest Preview (Please check these messages):`)
        this.log(`Title: ${tdoc.title}`)
        this.log(`Rule: ${tdoc.rule}`)
        this.log(`Time: ${new Date(tdoc.beginAt).toLocaleString()} ~ ${new Date(tdoc.endAt).toLocaleString()}`)
        if (new Date(tdoc.beginAt).getTime() >= new Date().getTime()) {
            this.log('Contest is not started')
            return false
        }
        if (new Date(tdoc.endAt).getTime() <= new Date().getTime()) {
            this.log('Contest is ended')
            return false
        }
        return true
    }
    async getScore(contestId: string, pid: string) {
        const { body: { psdict } } = await this.get(`/contest/${contestId}/problems`)
        const { rid, status, score, subtasks } = psdict[pid]
        console.log(`Record ${rid} ${score} (${STATUS_TEXTS[status as STATUS]})`)
        this.log(`RID: ${rid}`)
        this.log(`Status: ${STATUS_TEXTS[status as STATUS]}`)
        this.log(`Score: ${score}`)
        for (let [k, v] of Object.entries(subtasks)) {
            let data = v as { type: string, score: number, status: STATUS }
            this.log(`Subtask ${k}(${data.type}): ${data.score} (${STATUS_TEXTS[data.status]})`)
        }
        return { rid, filename: `code/${contestId}_P${pid}_${this.username}_${rid}_${score}.cpp`, score }
    }
    async getCode(record: string, filename: string) {
        const { body } = await this.get(`/record/${record}`)
        writeFileSync(filename, (body as { rdoc: { code: string } }).rdoc.code)
        console.log(`Saved ${filename}`)
    }
}

interface Request {
    url: string
    username: string
    cookie: string
    domain: string
    contestId: string
    pid: string
}

export default async function queryScore(request: any) {
    const text = await request.text()
    try {
        console.log(text)
        const body = JSON.parse(text) as Request
        console.log(body)
        if (body.url !== 'https://oj.hailiangedu.com')
            throw new Error('Must query HLOJ.')
        const service = new Service(body.url, body.username, body.cookie, body.domain)
        const loggedIn: boolean = await service.checkLoggedIn()
        if (!loggedIn) throw new Error('Not logged in.')
        service.log('Logged in')
        const getContestSuccessful = await service.getContest(body.contestId)
        if (!getContestSuccessful) throw new Error('Contest not found.')
        const { rid, filename, score } = await service.getScore(body.contestId, body.pid)
        await service.getCode(rid, filename)
        return new Response(
            JSON.stringify({
                error: false,
                score,
            }),
            { headers: { "content-type": "application/json" } },
        )
    }
    catch (e) {
        console.error(e)
        return new Response(
            JSON.stringify({ error: true }),
            { headers: { "content-type": "application/json" } },
        )
    }
}