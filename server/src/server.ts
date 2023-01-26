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

export default {
  port: new URL(ExampleAPIConfig.apiHost).port,
  fetch(request: Request) {
    return exampleAPIServer.handleRequest(request)
  },
}
