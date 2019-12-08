import LivingAudioChildren from "components/LivingAudioChildren"
import Journey from "components/Journey"
import Entity from "components/Entity"

let LAC
let journey
let subject

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.colorMode(p.HSB)

    LAC = new LivingAudioChildren(p)
    LAC.setup()

    journey = new Journey(p)
    journey.setup()

    subject = new Entity(
      p,
      64,
      p.createVector(0, 0, 0),
      p.createVector(0, 0, 0),
      p.color(100, 100, 100)
    )
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.keyPressed = () => {
    subject.rotate(p.createVector(50, 0, 10))
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)
    LAC.render(250, -200, -200)
    journey.render(-250, 0, -400, 0, 0, 0)
    subject.render()
  }
}
