// API Server
/////////////

import { APIPointFunction, APIRuntimeSpecs, APISpecification } from "./api-specification"
import * as http from 'http'

export function makeAPIServer<API extends APISpecification>(api: APIRuntimeSpecs<API>, handlers: APIHandlers<API>) {
  return new APIServer(api, handlers)
}

export function wrapAPIServers(...apiServers: APIServer<any>[]) {
  return new APIServerWrapper(apiServers)
}

class APIServerWrapper {
  constructor(private apiServers: APIServer<any>[]) { }

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    for (let apiServer of this.apiServers) {
      if (apiServer.hasHandler(req)) {
        await apiServer.handleRequest(req, res)
        return true
      }
    }

    return false
  }
}

type APIHandlers<API extends APISpecification> = {
  [Key in keyof API['apiPoints']]: APIPointFunction<API['apiPoints'][Key]>
}

class APIServer<API extends APISpecification> {
  constructor(
    private api: APIRuntimeSpecs<API>,
    private handlers: APIHandlers<API>
  ) { }

  hasHandler(req: http.IncomingMessage): boolean {
    return !!this.getHandler(req)
  }

  getHandler(req: http.IncomingMessage) {
    let path = req.url!
    let base = '/' + this.api.apiBaseRoute + '/'
    if (!path.startsWith(base)) {
      return null
    }
    let handlerName = path.replace(base, '')
    return this.handlers[handlerName]
  }

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    let handler = this.getHandler(req)
    if (!handler) {
      return this.sendNotFound(req, res)
    }

    let apiRequest = await this.readAPIRequest(req)
    let apiResponse = await handler(apiRequest)

    res.writeHead(200)
    res.end(JSON.stringify(apiResponse))
  }

  private sendNotFound(req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(404)
    res.end(`Not found: ${req.url}`)
  }

  private async readAPIRequest(req: http.IncomingMessage) {
    const buffer = []
    for await (const chunk of req) {
      buffer.push(chunk)
    }
    const data = Buffer.concat(buffer)

    return JSON.parse(data.toString())
  }
}
