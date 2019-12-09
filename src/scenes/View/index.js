import React, { useState } from "react"
import styled from "styled-components/macro"
import P5WrapperBase from "react-p5-wrapper"

import intro from "clips/intro"
import Helmet from "components/Helmet"

const P5Wrapper = styled(P5WrapperBase)`
  background: white;
`

const CenteredDiv = styled.div`
  font-family: "monospace", sans-serif;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function View(props) {
  const [click, setClick] = useState("false")

  if (click === "false") {
    return (
      <CenteredDiv onClick={() => setClick("true")}>
        <Helmet title="View" />
        Click to start
      </CenteredDiv>
    )
  }

  return (
    <>
      <Helmet title="View" />
      <P5Wrapper sketch={intro} />
    </>
  )
}
