#!/bin/bash npx ts-node

import { APIRuntimeSpecs, APISpecification, makeAPIClient } from './api-specification'
import * as http from 'http'
import { makeAPIServer } from './api-server'

// Example API Specification
////////////////////////////

export interface ExampleAPI extends APISpecification {
  apiPoints: {
    upperCase: {
      request: { text: string }
      response: { upperCased: string }
    }
    double: {
      request: { num: number }
      response: { doubled: number }
    }
  }
}

export const ExampleAPI: APIRuntimeSpecs<ExampleAPI> = {
  apiHost: 'http://localhost:3004',
  apiBaseRoute: 'api/ExampleAPI',
  apiPointNames: ['upperCase', 'double'],
}

// Example API Server implementation
////////////////////////////////////

let exampleAPIServer = makeAPIServer(ExampleAPI, {
  upperCase: async ({ text }) => {
    return { upperCased: text.toUpperCase() }
  },
  double: async ({ num }) => {
    return { doubled: num * 2 }
  },
} as const)

// Example run of server & client
/////////////////////////////////

setTimeout(async function runExampleAPIServerAndClient() {
  let serverListener = http
    .createServer((req, res) => {
      exampleAPIServer.handleRequest(req, res)
    })
    .listen(3004)

  await runClient()

  await serverListener.close()
})

async function runClient() {
  let exampleAPIClient = makeAPIClient(ExampleAPI)
  let res3 = await exampleAPIClient.upperCase({ text: 'lowercase' })
  let res = await exampleAPIClient.double({ num: 4 })
  let res2 = await exampleAPIClient.upperCase({ text: 'lowercase' })

  console.log(res.doubled === 8, res2.upperCased === 'LOWERCASE')
}
