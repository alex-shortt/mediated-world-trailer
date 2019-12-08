import React from "react"
import styled from "styled-components/macro"
import P5WrapperBase from "react-p5-wrapper"

import intro from "clips/intro"
import Helmet from "components/Helmet"

const P5Wrapper = styled(P5WrapperBase)`
  background: white;
`

export default function View(props) {
  return (
    <>
      <Helmet title="View" />
      <P5Wrapper sketch={intro} />
    </>
  )
}
