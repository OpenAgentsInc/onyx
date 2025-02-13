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

  state = {
    open: false
  }

  componentDidMount() {
    console.log("Drawer mounted", {
      element: this.props.element,
      options: this.props.options
    })
  }

  handleBehavior = (behavior: any) => {
    console.log("Drawer handling behavior", behavior)
    if (behavior?.action === 'set-drawer-state') {
      const newState = behavior.state === 'open'
      console.log("Setting drawer state to:", newState)
      this.setState({ open: newState }, () => {
        console.log("Drawer state updated to:", this.state)
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    console.log("Drawer componentDidUpdate", {
      prevBehavior: prevProps.options?.behavior,
      newBehavior: this.props.options?.behavior,
      currentState: this.state
    })

    const behavior = this.props.options?.behavior
    if (behavior?.action === 'set-drawer-state') {
      this.handleBehavior(behavior)
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
        }}
        onClose={() => {
          console.log("Drawer onClose triggered")
          this.setState({ open: false }, () => {
            console.log("Drawer state after onClose:", this.state)
          })
        }}
        drawerType="slide"
        drawerPosition="left"
        drawerStyle={styles.drawerContent}
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
    backgroundColor: '#000',
  },
  mainContent: {
    flex: 1,
  },
})