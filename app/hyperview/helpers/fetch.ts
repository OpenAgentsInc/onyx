export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  return fetch(input, {
    ...init,
    headers: {
      // Add any default headers here
      ...init.headers,
    },
    mode: 'cors',
  })
}