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

  render() {
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
        onOpen={() => this.setState({ open: true })}
        onClose={() => this.setState({ open: false })}
        drawerType="slide"
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
