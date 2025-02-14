import Hyperview, { HvComponentProps } from "hyperview"
import React from "react"
import { Image, ImageStyle } from "react-native"

// Add a mapping of image paths to their require statements
const imageMapping: { [key: string]: any } = {
  'logo-500': require('../../../../assets/images/design/OA-Logomark-p-500.png'),
  'logo': require('../../../../assets/images/design/OA-Logomark.png'),
  'loading': require('../../../../assets/images/design/Onyx-Animation-Compressed.gif'),
  'spacer': require('../../../../assets/images/design/Spacer.png'),
};

export class LocalImage extends React.PureComponent<HvComponentProps> {
  static namespaceURI = 'https://openagents.com/hyperview-local';
  static localName = 'image';
  static localNames = ['image'];

  render() {
    // Get props from HXML attributes and stylesheets
    const props = Hyperview.createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );

    // Get the source path from the src attribute
    const srcPath = props.src || '';

    // Remove src from props since we'll use source for Image
    delete props.src;

    try {
      const source = imageMapping[srcPath];
      if (!source) {
        throw new Error(`Image not found in mapping: ${srcPath}`);
      }

      return (
        <Image
          {...props}
          source={source}
          style={props.style as ImageStyle}
        />
      );
    } catch (error) {
      console.error(`Failed to load local image: ${srcPath}`, error);
      return null;
    }
  }
}
