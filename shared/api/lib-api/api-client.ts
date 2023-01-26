import { APIDefinition, APIPointFunction, APIConfig, PathsOfAPI, APIPoints, APIPointPath } from './api-types'

// API Client
/////////////

// TODO Make timeout a setting
export function makeAPIClient<API extends APIDefinition>(api: APIConfig<API>): APIClient<API> {
  let apiClient: any = {}
  for (let apiPointName of api.apiPointNames) {
    apiClient[apiPointName] = makeAPIPointClientFunction(api, apiPointName as string)
  }
  return apiClient as APIClient<API>
}

type APIClient<API extends APIDefinition> = {
  [Key in PathsOfAPI<API>]: APIPointFunction<API['apiPoints'][Key]>
}

function makeAPIPointClientFunction<API extends APIDefinition, APIPoint extends APIPoints>(
  api: APIConfig<API>,
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
