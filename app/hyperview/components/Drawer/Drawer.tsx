import Hyperview from "hyperview"
import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8

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
    isOpen: false
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

    // Handle behavior
    const behavior = this.props.options?.behavior
    if (behavior?.action === 'toggle-drawer') {
      console.log("Toggling drawer", { behavior })
      this.setState({ isOpen: !this.state.isOpen })
    }
  }

  render() {
    console.log("Drawer render", {
      state: this.state,
      element: this.props.element,
      options: this.props.options
    })

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
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          {Hyperview.renderElement(
            mainContent,
            this.props.stylesheets,
            this.props.onUpdate,
            this.props.options,
          )}
        </View>

        {/* Drawer Overlay */}
        {this.state.isOpen && (
          <View style={styles.overlay}>
            {/* Drawer Content */}
            <View style={styles.drawer}>
              {Hyperview.renderElement(
                drawerContent,
                this.props.stylesheets,
                this.props.onUpdate,
                this.props.options,
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#000',
  },
})