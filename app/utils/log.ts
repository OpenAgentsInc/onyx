interface LogProps {
  name: string
  preview?: string
  value?: string | object
  important?: boolean
}

export const log = (input: LogProps | string) => {
  if (typeof input === 'string') {
    if (__DEV__) {
      console.tron.display({ name: input })
    } else {
      console.log(input)
    }
  } else {
    if (__DEV__) {
      console.tron.display(input)
      console.log(input)
    } else {
      console.log(input)
    }
  }
}