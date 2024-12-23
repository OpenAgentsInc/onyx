interface LogProps {
  name: string
  preview?: string
  value?: string | object
  important?: boolean
}

export const log = (object: LogProps) => {
  if (__DEV__) {
    console.tron.display(object)
  } else {
    console.log(object)
  }
}