import React from "react"
import { Keyboard, TouchableWithoutFeedback, View } from "react-native"

const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback 
      onPress={() => {
        console.log("DismissKeyboardView pressed")
        Keyboard.dismiss()
      }} 
      accessible={false}
    >
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  )
}
const DismissKeyboardView = DismissKeyboardHOC(View)

export { DismissKeyboardView }