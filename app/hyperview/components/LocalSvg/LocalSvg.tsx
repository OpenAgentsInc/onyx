import React from "react"
import { Path, Svg } from "react-native-svg"
import { SVG_CONTENT } from "./svg-content"

import type { PathProps } from "react-native-svg"
import type { HvComponentProps } from "hyperview"

type SvgData = {
  viewBox: string;
  path: string;
} & Omit<PathProps, 'd'>;

export class LocalSvg extends React.PureComponent<HvComponentProps> {
  static namespaceURI = 'https://openagents.com/hyperview-local';
  static localName = 'svg';

  render() {
    const src = this.props.element.getAttribute('src') || '';
    const width = this.props.element.getAttribute('width') || '24';
    const height = this.props.element.getAttribute('height') || '24';

    try {
      const svgData = SVG_CONTENT[src as keyof typeof SVG_CONTENT] as SvgData;
      if (!svgData) {
        console.warn(`SVG not found in mapping: ${src}`);
        return null;
      }

      const { viewBox, path, ...pathProps } = svgData;

      return (
        <Svg
          width={width}
          height={height}
          viewBox={viewBox}
        >
          <Path
            d={path}
            {...pathProps}
          />
        </Svg>
      );
    } catch (error) {
      console.warn(`Failed to load local SVG: ${src}`, error);
      return null;
    }
  }
}
