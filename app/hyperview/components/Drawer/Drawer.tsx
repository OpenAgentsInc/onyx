import Hyperview from "hyperview"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Drawer as RNDrawer } from "react-native-drawer-layout"

interface Props {
  element: Element
  stylesheets: any
  onUpdate: (opts: any) => void
  options: any
}

export class Drawer extends React.PureComponent<Props> {
  static namespaceURI = 'https://openagents.com/hyperview-local'
  static localName = 'drawer'

  static behaviorRegistry = {
    'set-drawer-state': (element: Element, args: any) => {
      console.log("Drawer behaviorRegistry triggered", { element, args })
      return {
        action: 'set-drawer-state',
        state: element.getAttribute('state'),
      }
    },
  }

  state = {
    open: false
  }

  componentDidMount() {
    console.log("Drawer mounted", {
      element: this.props.element,
      options: this.props.options
    })
  }

  componentDidUpdate(prevProps: Props) {
    console.log("Drawer componentDidUpdate", {
      prevOptions: prevProps.options,
      newOptions: this.props.options,
      currentState: this.state
    })

    const behavior = this.props.options?.behavior
    if (behavior?.action === 'set-drawer-state') {
      const newState = behavior.state === 'open'
      console.log("Setting drawer state from behavior", { 
        newState, 
        behaviorState: behavior.state,
        currentlyOpen: this.state.open 
      })
      if (newState !== this.state.open) {
        this.setState({ open: newState })
      }
    }
  }

  render() {
    console.log("Drawer render", {
      state: this.state,
      element: this.props.element,
      options: this.props.options
    })

    const props = Hyperview.createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    )

    // Get drawer content and main content from child elements
    const drawerContent = Array.from(this.props.element.children).find(
      child => child.getAttribute("slot") === "drawer-content"
    )
    const mainContent = Array.from(this.props.element.children).find(
      child => child.getAttribute("slot") === "main-content"
    )

    if (!drawerContent || !mainContent) {
      console.error("Drawer requires both drawer-content and main-content slots")
      return null
    }

    return (
      <RNDrawer
        open={this.state.open}
        onOpen={() => {
          console.log("Drawer onOpen triggered")
          this.setState({ open: true }, () => {
            console.log("Drawer state after onOpen:", this.state)
          })
          if (props.onOpen) {
            this.props.onUpdate({
              type: 'behavior',
              name: props.onOpen,
              trigger: 'on-drawer-open',
            })
          }
        }}
        onClose={() => {
          console.log("Drawer onClose triggered")
          this.setState({ open: false }, () => {
            console.log("Drawer state after onClose:", this.state)
          })
          if (props.onClose) {
            this.props.onUpdate({
              type: 'behavior',
              name: props.onClose,
              trigger: 'on-drawer-close',
            })
          }
        }}
        drawerType={props.drawerType || "slide"}
        drawerPosition={props.drawerPosition || "left"}
        renderDrawerContent={() => (
          <View style={styles.drawerContent}>
            {Hyperview.renderElement(
              drawerContent,
              this.props.stylesheets,
              this.props.onUpdate,
              this.props.options,
            )}
          </View>
        )}
      >
        <View style={styles.mainContent}>
          {Hyperview.renderElement(
            mainContent,
            this.props.stylesheets,
            this.props.onUpdate,
            this.props.options,
          )}
        </View>
      </RNDrawer>
    )
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
})