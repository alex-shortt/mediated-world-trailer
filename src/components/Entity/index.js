import p5 from "p5"

export default class Entity {
  constructor(p, size, pos, rot, fill) {
    this.p = p

    this.size = size
    this.targetSize = size

    this.pos = pos
    this.targetPos = pos.copy()
    this.rot = rot
    this.targetRot = rot.copy()

    this.easing = 0.05
    this.fill = fill

    this.fill = fill
    this.targetFill = p.color(fill)
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
      easing
    } = this

    // ease towards new pos
    const posDiff = p5.Vector.sub(targetPos, pos)
    pos.add(posDiff.mult(easing))

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

  render() {
    this.update()

    const { p, pos, rot, size, fill } = this

    p.push()
    p.strokeWeight(2)
    p.fill(fill)
    p.translate(pos)
    p.rotateX(rot.x)
    p.rotateY(rot.y)
    p.rotateZ(rot.z)
    p.box(size)
    p.pop()
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
}
