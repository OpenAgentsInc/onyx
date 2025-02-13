export const fetchWrapper = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  console.log("Fetching:", input)
  console.log("Init:", init)

  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        // Add any default headers here
        ...init.headers,
      },
      mode: 'cors',
    })

    console.log("Response status:", response.status)
    const text = await response.text()
    // console.log("Response body:", text)

    // Create a new response with the logged body
    return new Response(text, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}
