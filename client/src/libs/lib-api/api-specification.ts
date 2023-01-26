// API Specification: types
///////////////////////////

export type APISpecification = {
  apiPoints: Record<APIPointPath, APIPoints>
}

export type APIRuntimeSpecs<API extends APISpecification> = {
  apiHost: string
  apiBaseRoute: string
  apiPointNames: PathsOfAPI<API>[]
}

export type APIPointFunction<APIPoint extends APIPoints> = (req: APIPoint['request']) => Promise<APIPoint['response']>

type PathsOfAPI<API extends APISpecification> = keyof API['apiPoints']
type APIPointPath = string
type APIPoints = {
  request: any
  response: any
}

// API Client
/////////////

type APIClient<API extends APISpecification> = {
  [Key in PathsOfAPI<API>]: APIPointFunction<API['apiPoints'][Key]>
}

export function makeAPIClient<API extends APISpecification>(api: APIRuntimeSpecs<API>): APIClient<API> {
  let apiClient: any = {}
  for (let apiPointName of api.apiPointNames) {
    apiClient[apiPointName] = makeAPIPointClientFunction(api, apiPointName as string)
  }
  return apiClient as APIClient<API>
}

function makeAPIPointClientFunction<API extends APISpecification, APIPoint extends APIPoints>(
  api: APIRuntimeSpecs<API>,
  apiPointName: APIPointPath,
): APIPointFunction<APIPoint> {
  // let apiPointURL = environment.apiURL(apiBaseRoute, apiPointName)
  return async (request: APIPoint['request']) => {
    let timeout = 7500
    let url = `${api.apiHost}/${api.apiBaseRoute}/${apiPointName}`

    let apiRes = await fetchWithTimeout(timeout, url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!apiRes.ok) {
      throw new Error(await apiRes.text())
    }

    return apiRes.json()
  }
}

async function fetchWithTimeout(timeout: number, url: string, params: RequestInit): Promise<Response> {
  const abortController = new AbortController()
  const id = setTimeout(() => abortController.abort(), timeout)
  const response = await fetch(url, { ...params, signal: abortController.signal })
  clearTimeout(id)
  return response
}
