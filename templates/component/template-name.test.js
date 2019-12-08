import React from "react"
import renderer from "react-test-renderer"
import "jest-styled-components"

import __TEMPLATE_NAME__ from "./index"

it("renders correctly", () => {
  const tree = renderer.create(<__TEMPLATE_NAME__ />).toJSON()

  expect(tree).toMatchSnapshot()
})
