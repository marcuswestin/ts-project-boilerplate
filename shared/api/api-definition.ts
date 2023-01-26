import { makeAPIClient } from './lib-api/api-client'
import { APIDefinition, APIConfig } from './lib-api/api-types'

interface ExampleAPI extends APIDefinition {
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

function makeAPIConfig<APIDef extends APIDefinition>(config: APIConfig<APIDef>): APIConfig<APIDef> {
  return config
}

export const ExampleAPIConfig = makeAPIConfig<ExampleAPI>({
  apiHost: 'http://localhost:4001',
  apiBaseRoute: 'api/ExampleAPI',
  apiPointNames: ['upperCase', 'double'],
})

export const apiClient = makeAPIClient(ExampleAPIConfig)
