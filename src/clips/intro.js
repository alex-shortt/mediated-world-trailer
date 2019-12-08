import LivingAudioChildren from "components/LivingAudioChildren"

let LAC

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    LAC = new LivingAudioChildren(p)
    LAC.setup()
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)
    LAC.render(0, 0, -200)
  }
}
