import { makeAPIServer } from '../../shared/api/lib-api/api-server'
import { ExampleAPIConfig } from '../../shared/api/api-definition'

let exampleAPIServer = makeAPIServer(ExampleAPIConfig, {
  upperCase: async ({ text }) => {
    return { upperCased: text.toUpperCase() }
  },
  double: async ({ num }) => {
    return { doubled: num * 2 }
  },
  // } as const) // needed?
})

let url = new URL(ExampleAPIConfig.apiHost)
console.log('Start on', url.port)

export default {
  port: parseInt(url.port),
  fetch(request: Request) {
    if (new URL(request.url).pathname === '/') {
      return new Response('Hello from server ', { status: 200 })
    }
    return exampleAPIServer.handleRequest(request)
  },
}

// let port = 7856
// console.log('Start on :' + port)
// export default {
//   port: port,
//   fetch(request: Request) {
//     return new Response('Hello asdfrom asdasd server', { status: 200 })
//   },
// }
