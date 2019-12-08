import React from "react"
import renderer from "react-test-renderer"
import "jest-styled-components"

import View from "./index"

it("renders correctly", () => {
  const tree = renderer.create(<View />).toJSON()

  expect(tree).toMatchSnapshot()
})
