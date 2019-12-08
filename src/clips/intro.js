import LivingAudioChildren from "components/LivingAudioChildren"
import Journey from "components/Journey"
import Entity from "components/Entity"

let LAC
let journey
let subject
const entities = []
let dist = 0

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.colorMode(p.HSB)

    LAC = new LivingAudioChildren(p)
    LAC.setup()

    journey = new Journey(p)
    journey.setup()

    subject = new Entity(p, { size: 64 })

    // for (let i = 0; i < 20; i += 1) {
    //   entities.push(
    //     new Entity(p, {
    //       size: 64,
    //       pos: p.createVector(i * 70 - 600, (i % 8) * 70 - 200, 0)
    //     })
    //   )
    // }
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)
    // LAC.render(250, -200, -200)
    // journey.render(0, 0, -400, 0, 0, 0)
    subject.render()

    if (p.millis() > 2000 && dist === 0) {
      subject.rotate(p.createVector(0, 0, (Math.PI * 1) / 3))
      dist += 1
    }

    if (p.millis() > 4000 && dist === 1) {
      subject.rotate(p.createVector(0, 0, (Math.PI * -2) / 3))
      dist += 1
    }

    if (p.millis() > 6000 && dist === 2) {
      subject.translate(p.createVector(0, 0, -700))
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

    // for (const entity of entities) {
    //   entity.render()
    // }
  }
}
