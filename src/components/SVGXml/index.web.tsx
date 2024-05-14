/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  May 6 2023
  SVGXml.web.tsx
  Renders svg given width and height for the web. Uses a div and dangerously sets the html.
*/
import { View } from 'react-native';
import React from 'react';

export default function SVGXml({
  xml,
  height,
  width,
}: {
  xml: string;
  width: number;
  height: number;
}) {
  return (
    <div dangerouslySetInnerHTML={{ __html: xml }} style={{
      height: height, width: width
    }} />
  );
}