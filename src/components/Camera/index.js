import p5 from "p5"

export default class Camera {
  constructor(p, props) {
    this.p = p

    this.pos = p.createVector(0, 0, 0)
    this.targetPos = p.createVector(0, 0, 0)

    this.lookPos = p.createVector(0, 0, 100)
    this.upDir = p.createVector(0, 1, 0)

    this.speed = 10
    this.easing = 0.05
  }

  follow(entity) {
    const { p } = this
    const pos = entity.getPos()

    this.pos = p.createVector(pos.x, pos.y, pos.z + 500)
    this.targetPos = p.createVector(pos.x, pos.y, pos.z + 500)
    this.lookPos = p.createVector(pos.x, pos.y, pos.z)
  }

  render() {
    const { p, pos, speed, targetPos, easing, lookPos, upDir } = this

    // ease towards new pos
    const posDiff = p5.Vector.sub(targetPos, pos).mult(easing)
    const deltaPos = p.createVector(
      posDiff.x < 0 ? p.max(posDiff.x, speed * -1) : p.min(posDiff.x, speed),
      posDiff.y < 0 ? p.max(posDiff.y, speed * -1) : p.min(posDiff.y, speed),
      posDiff.z < 0 ? p.max(posDiff.z, speed * -1) : p.min(posDiff.z, speed)
    )
    pos.add(deltaPos)

    p.camera(
      pos.x,
      pos.y,
      pos.z,
      lookPos.x,
      lookPos.y,
      lookPos.z,
      upDir.x,
      upDir.y,
      upDir.z
    )
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed
  }

  setPos(newPos) {
    this.targetPos = newPos
  }

  setLookPos(newLookPos) {
    this.lookPos = newLookPos
  }

  setUpDir(newUpDir) {
    this.upDir = newUpDir
  }

  setEasing(newEasing) {
    this.easing = newEasing
  }

  getPos() {
    return this.pos
  }
}
