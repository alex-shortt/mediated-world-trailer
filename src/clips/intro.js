import p5 from "p5"

import LivingAudioChildren from "components/LivingAudioChildren"
import Entity from "components/Entity"
import Nature from "components/Nature"
import Camera from "components/Camera"
import Director from "components/Director"
import codePart from "assets/codepart.mp3"

import "p5/lib/addons/p5.sound"

let music
let director
let subject
let nature
let LAC
let camera
let fps
const followers = []
let renderNature = true

const pickedClusters = []

export default function sketch(p) {
  // eslint-disable-next-line no-param-reassign
  p.preload = () => {
    music = p.loadSound(codePart)
  }

  // eslint-disable-next-line no-param-reassign
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.colorMode(p.HSB, 360, 100, 100, 255)

    LAC = new LivingAudioChildren(p, {})
    camera = new Camera(p, {})
    nature = new Nature(p, {})
    subject = new Entity(p, { size: 64, ambientWeight: 1.3 })
    director = new Director(p)

    // fade in time
    // director.addDurationEvent(0, 5, () => {
    //   p.background(255)
    // })

    // pan around subject
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

    // pick random clusters
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

    // cluster pan 1
    director.addTriggerEvent(18, (time, start) => {
      camera.setSpeed(8)
      camera.setEasing(0.05)

      const clusterPos = pickedClusters[0].getPos()

      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    // cluster pan 2
    director.addTriggerEvent(22.7, (time, start) => {
      const clusterPos = pickedClusters[1].getPos()

      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    // cluster pan 3
    director.addTriggerEvent(27.2, (time, start) => {
      const clusterPos = pickedClusters[2].getPos()
      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    // cluster pan 4
    director.addTriggerEvent(31.5, (time, start) => {
      const clusterPos = pickedClusters[3].getPos()
      camera.setPos(
        p.createVector(clusterPos.x, clusterPos.y, clusterPos.z + 500)
      )
      camera.setLookPos(clusterPos)
    })

    // back to subject
    director.addDurationEvent(36.4, 62.9, () => {
      camera.follow(subject)
    })

    // fly off!
    director.addTriggerEvent(40.9, () => {
      subject.setSpeed(30)
      subject.goTo(p.createVector(0, 0, -12000))
      subject.setAmbientWeight(1.85)
    })

    // fly up
    director.addTriggerEvent(45.6, () => {
      subject.goTo(p.createVector(0, -12000, -12000))
    })

    // side view
    director.addTriggerEvent(49.9, () => {
      camera.setFollowPos(p.createVector(500, -90, -90))
    })

    // front view
    director.addTriggerEvent(54.55, () => {
      camera.setFollowPos(p.createVector(0, 0, -500))
    })

    // slow down
    director.addTriggerEvent(59.3, () => {
      const subPos = subject.getPos()
      const stopPos = p5.Vector.add(subPos, p.createVector(0, -600, -600))
      subject.goTo(stopPos)
    })

    // add lac, add followers
    director.addTriggerEvent(62.4, () => {
      const subPos = subject.getPos()
      LAC.setPos(p.createVector(subPos.x, subPos.y, subPos.z - 1200))
      const lacPos = LAC.getPos()
      for (let i = 0; i < 13; i += 1) {
        const radius = 500
        const randCirc = Math.random()
        const x = lacPos.x + Math.sin(randCirc * Math.PI * 2) * radius
        const y = lacPos.y + Math.sin(Math.random() * Math.PI * 2) * radius
        const z = lacPos.z + Math.cos(randCirc * Math.PI * 2) * radius
        const followerPos = p.createVector(x, y, z)
        const follower = new Entity(p, {
          size: Math.random() * 50 + 20,
          pos: followerPos,
          ambientWeight: 0.7
        })
        followers.push(follower)
      }
    })

    // render lac and followers for the rest of the video
    director.addDurationEvent(65.9, 200, () => {
      LAC.render()
      const hue = LAC.getHue()
      // console.log(hue)
      for (const follower of followers) {
        follower.setHue(hue)
        follower.render()
      }
    })

    // halfway through following pan
    director.addTriggerEvent(65.9, () => {
      LAC.setNumBoxes(11)
    })

    // pan around to look at lac
    director.addDurationEvent(63.7, 77.61, (time, start, stop, duration) => {
      camera.setSpeed(3000)
      camera.setEasing(1)
      const subPos = subject.getPos()
      const completion = (time - start) / duration
      const cx = Math.sin(completion * Math.PI) * 500
      const cz = Math.cos(completion * Math.PI) * -500
      camera.setPos(p.createVector(subPos.x + cx, subPos.y, subPos.z + cz))
      nature.setRenderDistance((1 - completion) * 3)
    })

    // rotate around lac
    director.addDurationEvent(77.61, 96, (time, start, stop, duration) => {
      renderNature = false
      camera.setSpeed(3000)
      camera.setEasing(1)
      const lacPos = LAC.getPos()
      camera.setLookPos(lacPos)
      const completion = (time - start) / duration
      const cx = Math.sin(completion * Math.PI) * 1300
      const cz = Math.cos(completion * Math.PI) * -1700
      camera.setPos(p.createVector(lacPos.x + cx, lacPos.y, lacPos.z + cz))
    })

    // send subject to followers, pan away
    director.addTriggerEvent(96, (time, start, stop, duration) => {
      subject.setAmbientWeight(0.5)
      subject.setSpeed(0.9)
      subject.setEasing(0.1)
      subject.translate(p.createVector(0, 0, -550))

      const lacPos = LAC.getPos()
      camera.setLookPos(lacPos)
      const cx = lacPos.x + 1700
      const cy = lacPos.y - 1000
      const cz = lacPos.z + 0
      camera.setSpeed(2)
      camera.setEasing(0.1)
      camera.setPos(p.createVector(cx, cy, cz))
    })

    // one with other beings, match hue
    director.addDurationEvent(110, 220, () => {
      subject.setHue(LAC.getHue())
    })

    director.setOffset()
    music.play()
  }

  // eslint-disable-next-line no-param-reassign
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // eslint-disable-next-line no-param-reassign
  p.mouseClicked = () => {
    // music.isPlaying() ? music.pause() : music.loop()
    console.log(director.getTime())
  }

  // eslint-disable-next-line no-param-reassign
  p.draw = () => {
    p.background(255)

    subject.render() // 0.2ms

    if (renderNature) {
      nature.render(camera.getPos()) // 50 ms
    }

    camera.render() // 0.02ms
    director.render() // 0.02ms

    // fps = p.frameRate()
    // console.log(`FPS: ${fps.toFixed(2)}`)
  }
}
