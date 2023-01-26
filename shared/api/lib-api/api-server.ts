// // API Server
// /////////////

import { APIPointFunction, APIConfig, APIDefinition } from './api-types'

export function makeAPIServer<API extends APIDefinition>(
  api: APIConfig<API>,
  handlers: APIHandlers<API>,
): APIServer<API> {
  return new APIServer(api, handlers)
}

type APIHandlers<API extends APIDefinition> = {
  [Key in keyof API['apiPoints']]: APIPointFunction<API['apiPoints'][Key]>
}

let corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'].join(', '),
  'Access-Control-Allow-Headers': [
    'Access-Control-Allow-Headers',
    'Origin,Accept',
    'X-Requested-With',
    'Content-Type',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ].join(', '),
}

class APIServer<API extends APIDefinition> {
  constructor(private api: APIConfig<API>, private handlers: APIHandlers<API>) {}

  hasHandler(req: Request): boolean {
    return !!this.getHandler(req)
  }

  getHandler(req: Request) {
    let path = new URL(req.url).pathname
    let base = '/' + this.api.apiBaseRoute + '/'
    if (!path.startsWith(base)) {
      return null
    }
    let handlerName = path.replace(base, '')
    return this.handlers[handlerName]
  }

  async handleRequest(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, statusText: 'No Content', headers: { ...corsHeaders } })
    }
    let handler = this.getHandler(req)
    if (!handler) {
      return new Response('Not found', { status: 404, statusText: 'Not found', headers: { ...corsHeaders } })
    }

    let apiRequest = await req.json()
    let apiResponse = await handler(apiRequest)

    return new Response(JSON.stringify(apiResponse), {
      status: 200,
      statusText: null,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// export function wrapAPIServers(...apiServers: APIServer<any>[]) {
//   return new APIServerWrapper(apiServers)
// }

// class APIServerWrapper {
//   constructor(private apiServers: APIServer<any>[]) {}

//   async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
//     for (let apiServer of this.apiServers) {
//       if (apiServer.hasHandler(req)) {
//         await apiServer.handleRequest(req, res)
//         return true
//       }
//     }

//     return false
//   }
// }
