import React from "react"
import renderer from "react-test-renderer"
import "jest-styled-components"

import FullScreenLoading from "./index"

it("renders correctly", () => {
  const tree = renderer.create(<FullScreenLoading />).toJSON()

  expect(tree).toMatchSnapshot()
})
