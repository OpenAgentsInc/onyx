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
  static localNames = ['svg'];

  render() {
    const src = this.props.element.getAttribute('src') || '';
    const width = this.props.element.getAttribute('width') || '24';
    const height = this.props.element.getAttribute('height') || '24';
    const color = this.props.element.getAttribute('color');

    try {
      const svgData = SVG_CONTENT[src as keyof typeof SVG_CONTENT] as SvgData;
      if (!svgData) {
        console.warn(`SVG not found in mapping: ${src}`);
        return null;
      }

      const { viewBox, path, fill, stroke, ...pathProps } = svgData;

      // If color is specified, use it for both fill and stroke if they exist in the original
      const colorProps = color ? {
        ...(fill && { fill: color }),
        ...(stroke && { stroke: color })
      } : {
        fill,
        stroke
      };

      return (
        <Svg
          width={width}
          height={height}
          viewBox={viewBox}
        >
          <Path
            d={path}
            {...colorProps}
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
