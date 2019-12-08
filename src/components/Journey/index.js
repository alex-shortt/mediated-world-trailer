export default class Journey {
  constructor(p) {
    this.p = p
    this.route = []
    this.boxSize = 26
    this.gHue = Math.random() * 360
    this.hueSpeed = 0.8
  }

  setup() {
    const { route, p } = this

    const length = 50
    for (let i = 0; i < length; i += 1) {
      route.push(
        new RouteItem(128 - (i / length) * 128, this.boxSize, route, p)
      )
    }
  }

  render(x, y, z, rx, ry, rz) {
    const { hueSpeed, route } = this

    this.gHue += hueSpeed
    if (this.gHue > 360) {
      this.gHue = 0
    }

    // render
    for (let i = 0; i < route.length; i += 1) {
      route[i].render(i, x, y, z, rx, ry, rz)
    }
  }
}

class RouteItem {
  constructor(radius, boxSize, route, p) {
    this.radius = radius
    this.cx = 0
    this.cy = 0
    this.cz = 0
    this.boxSize = boxSize
    this.route = route
    this.p = p
  }

  getY() {
    return -this.cy
  }

  render(i, x, y, z, rx, ry, rz) {
    const { radius, boxSize, route, p } = this

    p.push()
    p.translate(x, y, z)
    p.rotateX(rx)
    p.rotateY(ry)
    p.rotateZ(rz)
    this.cx = 0
    this.cy =
      (p.noise((p.frameCount * 0.5 + i * 1.2) * 0.006) - 0.5) * p.windowHeight
    this.cz = -i * boxSize + 400 + boxSize
    const angleShift =
      (i / (route.length - 1)) * Math.PI +
      p.frameCount * 0.015 +
      p.sin(p.frameCount * 0.01 + i * 0.1)
    const circum = 2 * Math.PI * radius

    const numEntities = p.int(circum / boxSize)
    for (let e = 0; e < numEntities; e += 1) {
      const angle = (e / (numEntities - 1)) * Math.PI * 2 + angleShift
      const ex = Math.cos(angle) * radius
      const ey = Math.sin(angle) * radius
      const ez = p.sin(p.frameCount * 0.01 + i * 0.1) * boxSize * 0.7
      p.push()
      p.fill(
        p.noise((p.frameCount * 0.05 + i + angle) * 0.4) * 360,
        p.map(p.noise(p.frameCount * 0.05 + i, angle), 0, 1, 64, 100),
        p.map(p.noise(angle, p.frameCount * 0.05 + i), 0, 1, 30, 100)
      )
      p.translate(this.cx + ex, this.cy + ey, this.cz + ez)
      p.strokeWeight(2)
      p.box(boxSize)
      p.pop()
    }
    p.pop()
  }
}
