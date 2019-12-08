import ReactGA from "react-ga"

ReactGA.initialize("")

const production = process.env.NODE_ENV === "production"

const actions = {
  set: (params = {}) => {
    if (production) {
      ReactGA.set(params)
    } else {
      console.log(`Google Analytics || Set: ${JSON.stringify(params)}`)
    }
  },
  pageview: page => {
    if (production) {
      ReactGA.pageview(page)
    } else {
      console.log(`Google Analytics || Page View: ${page}`)
    }
  }
}

export default actions
