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

  componentDidMount() {
    console.log("Drawer mounted", {
      element: this.props.element,
      options: this.props.options
    })
  }

  componentDidUpdate(prevProps: Props) {
    console.log("Drawer componentDidUpdate", {
      prevBehavior: prevProps.options?.behavior,
      newBehavior: this.props.options?.behavior,
      currentState: this.props.options?.drawerOpen
    })

    const behavior = this.props.options?.behavior
    if (behavior?.action === 'set-drawer-state') {
      console.log("Processing drawer behavior", behavior)
      const newState = behavior.state === 'open'
      console.log("Setting drawer state to:", newState)
      this.props.options?.setDrawerOpen?.(newState)
    }
  }

  render() {
    console.log("Drawer render", {
      drawerOpen: this.props.options?.drawerOpen,
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
        open={this.props.options?.drawerOpen}
        onOpen={() => {
          console.log("Drawer onOpen triggered")
          this.props.options?.setDrawerOpen?.(true)
        }}
        onClose={() => {
          console.log("Drawer onClose triggered")
          this.props.options?.setDrawerOpen?.(false)
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