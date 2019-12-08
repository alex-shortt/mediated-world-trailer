import React from "react"
import { Helmet as ReactHelmet } from "react-helmet"

export default function Helmet(props) {
  const { title = "Trailer | mediated.world", children } = props

  return (
    <ReactHelmet>
      <title>{title}</title>
      {children}
    </ReactHelmet>
  )
}
