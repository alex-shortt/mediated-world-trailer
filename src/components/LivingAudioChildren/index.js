import "p5/lib/addons/p5.sound"
import p5 from "p5"

export default class LivingAudioChildren {
  constructor(p) {
    this.p = p
    this.numBoxes = 7
    this.zoom = 50
    this.boxesX = []
    this.rotBoost = 0
    this.mic = new p5.AudioIn()
    this.amp = new p5.Amplitude(0.8)
    this.fft = new p5.FFT()
    this.spectrum = this.fft.analyze()

    this.setup()
  }

  setup() {
    const { p, boxesX, zoom, numBoxes, fft, mic, amp } = this

    mic.start()
    fft.setInput(mic)

    for (let x = 0; x < numBoxes; x += 1) {
      boxesX.push([])
      for (let y = 0; y < numBoxes; y += 1) {
        boxesX[x].push([])
        for (let z = 0; z < numBoxes; z += 1) {
          const pX = x - p.int(numBoxes / 2)
          const pY = y - p.int(numBoxes / 2)
          const pZ = z - p.int(numBoxes / 2)
          boxesX[x][y].push(new Box(pX, pY, pZ, zoom, numBoxes, p, amp))
        }
      }
    }
  }

  render(x, y, z) {
    const { p, boxesX, mic, fft } = this

    p.push()
    const level = mic.getLevel(0.3)

    this.rotBoost += level * level * 0.001
    p.translate(x, y, z)
    p.rotateY(p.frameCount * 0.004 + this.rotBoost)
    p.rotateX(p.frameCount * 0.002 + this.rotBoost)
    p.rotateZ(p.frameCount * 0.001 + this.rotBoost)
    for (const row of boxesX) {
      for (const column of row) {
        for (const box of column) {
          box.update(this.spectrum)
          box.render()
        }
      }
    }
    this.spectrum = fft.analyze()
    p.pop()
  }
}

class Box {
  constructor(x, y, z, size, numBoxes, p, amp) {
    this.p = p
    this.size = size
    this.x = x
    this.y = y
    this.z = z
    this.energy = 0
    this.deltaEnergy = 0
    this.numBoxes = numBoxes || 11
    this.amp = amp
  }

  update(spectrum) {
    this.spectrum = spectrum

    const prevEnergy = this.energy
    this.energy = this.getRangeEnergy()
    this.deltaEnergy = this.energy - prevEnergy
  }

  getRangeEnergy() {
    const { spectrum, numBoxes, p } = this

    const dist = p.abs(this.x) + p.abs(this.y) + p.abs(this.z)
    const maxDist = p.int(numBoxes / 2) * 3

    const size = p.int(spectrum.length / maxDist)
    const start = p.int(p.map(dist / maxDist, 0, 1, 0, spectrum.length - size))

    let maxEnergy = 0
    let minEnergy = 0
    let sum = 0
    for (let i = start; i < start + size; i += 1) {
      maxEnergy = p.max(spectrum[i] || 0, maxEnergy)
      minEnergy = p.min(spectrum[i] || 0, minEnergy)
      sum += spectrum[i] || 0
    }
    const avg = sum / size

    return maxEnergy
  }

  render() {
    const { p, amp } = this
    p.push()

    // move
    const spacing = this.size * 1.3 * p.map(amp.getLevel(), 0, 1, 1, 1.2)
    p.translate(this.x * spacing, this.y * spacing, this.z * spacing)

    // color
    const energy = p.map(this.energy, 0, 255, 0, 100)
    const s = 95
    const v = p.int(p.map(energy, 0, 100, 10, 95))
    const sizeColorMod = 0.01 * this.x * this.y * this.z
    const deltaColorMod = p.abs(this.deltaEnergy) * 0.04
    const h = p.map(
      p.sin(p.frameCount * 0.005 - sizeColorMod - deltaColorMod),
      -1,
      1,
      0,
      360
    )
    p.fill(p.color(p.int(h), s, v))
    p.strokeWeight(2)

    // rotate
    p.rotateX(p.map(energy, 0, 100, 0, Math.PI * 2))
    p.rotateY(p.map(energy, 0, 100, 0, Math.PI * 2))
    p.rotateZ(p.map(energy, 0, 100, 0, Math.PI * 2))

    // draw
    p.box(this.size * energy * 0.01)
    p.pop()
  }
}
