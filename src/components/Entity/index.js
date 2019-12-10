import p5 from "p5"
import hash from "hash.js"
import uuid from "uuid/v4"

export default class Entity {
  constructor(p, props) {
    const {
      size,
      pos = p.createVector(0, 0, 0),
      rot = p5.Vector.random3D().mult(Math.PI * 2),
      fill = p.color(Math.random() * 360, 100, 60),
      easing = 0.05,
      speed = 50,
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

    this.size = size || 150 * idHash(this.id, 10)
    this.targetSize = size

    this.pos = pos
    this.offsetPos = p.createVector(0, 0, 0)
    this.targetPos = pos.copy()
    this.rot = rot
    this.offsetRot = p.createVector(0, 0, 0)
    this.targetRot = rot.copy()

    this.fill = fill
    this.offsetFill = p.createVector(0, 0, 0)
    this.targetFill = p.color(fill)

    this.weights = []
    const numWeights = 16
    for (let i = 0; i < numWeights; i += 1) {
      this.weights[i] = idHash(this.id, i)
    }

    console.log(`Created entity with id ${this.id}`)
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
    const posDiff = p5.Vector.sub(targetPos, pos).mult(easing)
    const deltaPos = p.createVector(
      posDiff.x < 0
        ? Math.max(posDiff.x, speed * -1)
        : Math.min(posDiff.x, speed),
      posDiff.y < 0
        ? Math.max(posDiff.y, speed * -1)
        : Math.min(posDiff.y, speed),
      posDiff.z < 0
        ? Math.max(posDiff.z, speed * -1)
        : Math.min(posDiff.z, speed)
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
    const { p, size, weights } = this

    // color mod
    const hueShift = this.weightedNoise(weights[1], 0.00001, 30)
    const satShift = this.weightedNoise(weights[2], 0.0001, 10)
    const brightShift = this.weightedNoise(weights[3], 0.0001, 10)
    // console.log("color: ", hueShift, satShift, brightShift)
    this.setOffsetFill(hueShift, satShift, brightShift)

    // pos mod
    const dx = this.weightedNoise(weights[5], 0.00017, size * 0.005)
    const dy = this.weightedNoise(weights[6], 0.00017, size * 0.005)
    const dz = this.weightedNoise(weights[7], 0.00017, size * 0.005)
    // console.log("pos: ", dx, dy, dz)
    this.translate(p.createVector(dx, dy, dz))

    // rot mod
    const rx = this.weightedNoise(weights[9], 0.0022, 0.03)
    const ry = this.weightedNoise(weights[10], 0.0022, 0.03)
    const rz = this.weightedNoise(weights[11], 0.0022, 0.03)
    // console.log("rot: ", rx, ry, rz)
    this.rotate(p.createVector(rx, ry, rz))
  }

  weightedNoise(weight, speed, amplitude) {
    const { p, ambientWeight } = this
    return (
      (p.noise(weight * 10, p.millis() * speed) - 0.5) *
      (weight * amplitude) *
      ambientWeight
    )
  }

  render() {
    this.ambientEffect()

    this.update()

    const { p, pos, rot, size, offsetRot, offsetPos } = this

    p.push()
    p.strokeWeight(2)
    p.fill(this.getFillWithOffset())
    p.translate(pos)
    p.translate(offsetPos)
    p.rotateX(rot.x)
    p.rotateY(rot.y)
    p.rotateZ(rot.z)
    p.rotateX(offsetRot.x)
    p.rotateY(offsetRot.y)
    p.rotateZ(offsetRot.z)
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

  setOffsetRot(offRot) {
    const { p } = this
    this.offsetRot = offRot
  }

  setOffsetPos(offPos) {
    const { p } = this
    this.offsetPos = offPos
  }

  getFillWithOffset() {
    const { p, fill, offsetFill } = this
    const hue = p.hue(fill) + offsetFill.x
    const sat = p.saturation(fill) + offsetFill.y
    const bright = p.brightness(fill) + offsetFill.z
    return p.color(hue, sat, bright)
  }

  setAmbientWeight(newAmbientWeight) {
    this.ambientWeight = newAmbientWeight
  }
}

function idHash(id, val) {
  const pos = val % (id.length - 1)
  const length = 2

  return (
    parseInt((id + id).substring(pos, pos + length), 16) /
    (Math.pow(16, length) - 1)
  )
}
