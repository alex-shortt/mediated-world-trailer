import p5 from "p5"
import hash from "hash.js"
import uuid from "uuid/v4"

export default class Entity {
  constructor(p, props) {
    const {
      size = 64,
      pos = p5.Vector.random3D(),
      rot = p5.Vector.random3D(),
      fill = p.color(Math.random() * 360, 100, 60),
      easing = 0.05,
      speed = 10,
      seed = uuid(),
      ambientWeight = 1
    } = props

    this.p = p

    this.id = hash
      .sha256()
      .update(seed)
      .digest("hex")

    this.speed = speed
    this.easing = easing

    this.ambientWeight = ambientWeight
    this.ambientDelta = 0

    this.size = size
    this.targetSize = size

    this.pos = pos
    this.targetPos = pos.copy()
    this.rot = rot
    this.targetRot = rot.copy()

    this.fill = fill
    this.offsetFill = p.createVector(0, 0, 0)
    this.targetFill = p.color(fill)

    console.log(`Entity with id ${this.id} created`)
  }

  update() {
    const {
      p,
      pos,
      targetPos,
      rot,
      targetRot,
      targetSize,
      size,
      fill,
      targetFill,
      speed,
      easing
    } = this

    // ease towards new pos
    const posDiff = p5.Vector.sub(targetPos, pos)
    posDiff.mult(easing)
    const deltaPos = p.createVector(
      p.min(posDiff.x, speed),
      p.min(posDiff.y, speed),
      p.min(posDiff.z, speed)
    )
    pos.add(deltaPos)

    // ease towards new rot
    const rotDiff = p5.Vector.sub(targetRot, rot)
    rot.add(rotDiff.mult(easing))

    // ease towards new size
    const sizeDiff = targetSize - size
    this.size += sizeDiff * easing

    // ease towards new fill
    const hueDiff = (p.hue(targetFill) - p.hue(fill)) * easing
    const satDiff = (p.saturation(targetFill) - p.saturation(fill)) * easing
    const brightDiff = (p.brightness(targetFill) - p.brightness(fill)) * easing
    this.fill = p.color(
      p.hue(fill) + hueDiff,
      p.saturation(fill) + satDiff,
      p.brightness(fill) + brightDiff
    )
  }

  ambientEffect() {
    const { p, size } = this

    const weights = []
    const numWeights = 16
    for (let i = 0; i < numWeights; i += 1) {
      weights[i] = this.getIdVal(Math.floor((i / numWeights) * 20), 4)
    }

    // increment noise walker
    this.ambientDelta += weights[4]

    // color mod
    const hueShift = this.weightedNoise(weights[1], 0.005, 40)
    const satShift = this.weightedNoise(weights[2], 0.001, 10)
    const brightShift = this.weightedNoise(weights[3], 0.001, 10)
    // console.log("color: ", hueShift, satShift, brightShift)
    this.setOffsetFill(hueShift, satShift, brightShift)

    // pos mod
    const dx = this.weightedNoise(weights[5], 0.01, size * 0.0001)
    const dy = this.weightedNoise(weights[6], 0.01, size * 0.0001)
    const dz = this.weightedNoise(weights[7], 0.01, size * 0.0001)
    // console.log("pos: ", dx, dy, dz)
    this.translate(p.createVector(dx, dy, dz))

    // rot mod
    const rx = this.weightedNoise(weights[9], 0.001, size * 0.00001)
    const ry = this.weightedNoise(weights[10], 0.001, size * 0.00001)
    const rz = this.weightedNoise(weights[11], 0.001, size * 0.00001)
    // console.log("rot: ", rx, ry, rz)
    this.rotate(p.createVector(rx, ry, rz))
  }

  getIdVal(pos, length) {
    return (
      parseInt(this.id.substring(pos, pos + length), 16) /
      (Math.pow(16, length) - 1)
    )
  }

  weightedNoise(weight, speed, amplitude) {
    const { p, ambientDelta, ambientWeight } = this
    return (
      (p.noise(weight, ambientDelta * speed) - 0.5) *
      (weight * amplitude) *
      ambientWeight
    )
  }

  render() {
    this.ambientEffect()

    this.update()

    const { p, pos, rot, size } = this

    p.push()
    p.strokeWeight(2)
    p.fill(this.getFillWithOffset())
    p.translate(pos)
    p.rotateX(rot.x)
    p.rotateY(rot.y)
    p.rotateZ(rot.z)
    p.box(size)
    p.pop()
  }

  getPos() {
    return this.pos
  }

  setEasing(newEasing) {
    this.easing = newEasing
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed
  }

  goTo(newPos) {
    this.targetPos = newPos
  }

  translate(addPos) {
    this.targetPos.add(addPos)
  }

  rotate(addRot) {
    this.targetRot.add(addRot)
  }

  setOffsetFill(dh, ds, db) {
    const { p } = this
    this.offsetFill = p.createVector(dh, ds, db)
  }

  getFillWithOffset() {
    const { p, fill, offsetFill } = this
    const hue = p.hue(fill) + offsetFill.x
    const sat = p.saturation(fill) + offsetFill.y
    const bright = p.brightness(fill) + offsetFill.z
    return p.color(hue, sat, bright)
  }
}
