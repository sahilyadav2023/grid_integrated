// src/custom.d.ts
import React from "react";
export type JSXElement = React.JSX.Element;

// src/custom.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
