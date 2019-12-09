import LivingAudioChildren from "components/LivingAudioChildren"
import Journey from "components/Journey"
import Entity from "components/Entity"
import Nature from "components/Nature"

let LAC
let journey
let subject
let nature
let dist = 0

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.colorMode(p.HSB)

    // LAC = new LivingAudioChildren(p)
    journey = new Journey(p)
    nature = new Nature(p, {})

    subject = new Entity(p, { size: 64, ambientWeight: 1.5 })
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)
    // LAC.render(250, -200, -200)
    journey.render(0, 0, -400, 0, 0, 0)
    subject.render()

    if (p.millis() > 2000 && dist === 0) {
      subject.rotate(p.createVector(0, (Math.PI * 1) / 3), 0)
      dist += 1
    }

    if (p.millis() > 4000 && dist === 1) {
      subject.rotate(p.createVector(0, (Math.PI * -2) / 3), 0)
      dist += 1
    }

    if (p.millis() > 6000 && dist === 2) {
      subject.translate(p.createVector(0, 0, -9700))
      dist += 1
    }

    const subjectPos = subject.getPos()
    p.camera(
      subjectPos.x,
      subjectPos.y,
      subjectPos.z + 500,
      subjectPos.x,
      subjectPos.y,
      subjectPos.z,
      0,
      1,
      0
    )

    nature.render(subjectPos.x, subjectPos.y, subjectPos.z)
  }
}
