// API Definition: types
///////////////////////////

export type APIDefinition = {
  apiPoints: Record<APIPointPath, APIPoints>
}

export type APIConfig<API extends APIDefinition> = {
  apiHost: string
  apiBaseRoute: string
  apiPointNames: PathsOfAPI<API>[]
}

export type APIPointFunction<APIPoint extends APIPoints> = (req: APIPoint['request']) => Promise<APIPoint['response']>

export type PathsOfAPI<API extends APIDefinition> = keyof API['apiPoints']
export type APIPointPath = string
export type APIPoints = {
  request: any
  response: any
}
