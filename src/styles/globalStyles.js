import { createGlobalStyle } from "styled-components/macro"
import "typeface-roboto"
import "normalize.css"

import "./fontawesome"

export default createGlobalStyle`
  body, html {
    margin: 0;
    background: white;
    height: 100%;
  }

  body {
    font-family: Avenir, Lato, Roboto, sans-serif;
    overflow: auto;
    overflow-x: hidden;
  }
  
  #root {
    height: 100%;
    overflow-y: hidden;
  }
`
