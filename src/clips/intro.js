import LivingAudioChildren from "components/LivingAudioChildren"
import Journey from "components/Journey"
import Entity from "components/Entity"
import Nature from "components/Nature"
import Camera from "components/Camera"
import Director from "components/Director"
import codePart from "assets/codepart.mp3"

import "p5/lib/addons/p5.sound"

let music
let director
let LAC
let journey
let subject
let nature
let camera
let fps

const pickedClusters = []

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.preload = () => {
    music = p.loadSound(codePart)
  }

  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    fps = p.frameRate()

    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.colorMode(p.HSB, 360, 100, 100, 255)
    music.play()
    console.warn(p.millis())

    director = new Director(p, { offset: p.millis() })
    camera = new Camera(p, {})
    nature = new Nature(p, {})
    subject = new Entity(p, { size: 64, ambientWeight: 1.2 })

    director.addDurationEvent(0, 5, () => {
      p.background(255)
      camera.follow(subject)
    })

    director.addDurationEvent(0, 18, (time, start, stop, duration) => {
      camera.setLookPos(subject.getPos())
      const completion = (time - start) / duration
      const cx =
        subject.getPos().x + p.sin((completion * Math.PI * 2) / 3) * 500
      const cz =
        subject.getPos().z + p.cos((completion * Math.PI * 2) / 3) * 500
      camera.setEasing(0.9)
      camera.setSpeed(1000)
      camera.setPos(p.createVector(cx, -40, cz))
    })

    director.addTriggerEvent(10, () => {
      const chunks = nature.getChunks()
      const clusters = []
      for (const chunk of chunks) {
        for (const cluster of chunk.getClusters()) {
          clusters.push(cluster)
        }
      }

      let clusterIndex = Math.floor(Math.random() * clusters.length)
      pickedClusters.push(clusters[clusterIndex])

      clusterIndex = Math.floor(Math.random() * clusters.length)
      pickedClusters.push(clusters[clusterIndex])

      clusterIndex = Math.floor(Math.random() * clusters.length)
      pickedClusters.push(clusters[clusterIndex])

      clusterIndex = Math.floor(Math.random() * clusters.length)
      pickedClusters.push(clusters[clusterIndex])
    })

    director.addTriggerEvent(18, (time, start) => {
      camera.setSpeed(10)
      camera.setEasing(0.05)

      const clusterPos = pickedClusters[0].getPos()

      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    director.addTriggerEvent(22.3, (time, start) => {
      camera.setSpeed(10)
      camera.setEasing(0.05)

      const clusterPos = pickedClusters[1].getPos()

      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    director.addTriggerEvent(26.9, (time, start) => {
      camera.setSpeed(10)
      camera.setEasing(0.05)

      const clusterPos = pickedClusters[2].getPos()
      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    director.addTriggerEvent(31.5, (time, start) => {
      camera.setSpeed(10)
      camera.setEasing(0.05)

      const clusterPos = pickedClusters[3].getPos()
      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    director.addTriggerEvent(35.9, () => {
      camera.follow(subject)
    })

    director.addTriggerEvent(40.8, () => {
      subject.setSpeed(50)
      subject.goTo(p.createVector(0, 0, -9000))
    })

    director.addDurationEvent(40.8, 65, () => {
      camera.follow(subject)
    })
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.mouseClicked = () => {
    music.isPlaying() ? music.pause() : music.loop()
    // console.log(director.getTime())
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)

    subject.render() // 0.2ms
    nature.render(camera.getPos()) // 50 ms
    camera.render() // 0.02ms
    director.render() // 0.02ms

    fps = p.frameRate()
    console.log(`FPS: ${fps.toFixed(2)}`)
  }
}
