import p5 from "p5"
import hash from "hash.js"
import uuid from "uuid/v4"

import Entity from "components/Entity"

export default class Nature {
  constructor(p, props) {
    const { seed = uuid(), chunkSize = 2000, renderDist = 2 } = props

    this.p = p

    this.id = hash
      .sha256()
      .update(seed)
      .digest("hex")

    this.chunks = []
    this.chunkSize = chunkSize

    this.renderDist = renderDist

    console.log(`Generated Nature with id ${this.id}`)
  }

  update(x, y, z) {
    const { chunkSize, renderDist } = this
    for (let dx = -renderDist; dx <= renderDist; dx += 1) {
      for (let dy = -renderDist; dy <= renderDist; dy += 1) {
        for (let dz = -renderDist * 2; dz <= renderDist * 2; dz += 1) {
          this.spawnChunkIfNew(
            x + dx * chunkSize,
            y + dy * chunkSize,
            z + dz * chunkSize
          )
        }
      }
    }
  }

  spawnChunkIfNew(x, y, z) {
    const { p, chunks, chunkSize } = this

    const thisChunkX = Math.floor(x / chunkSize)
    const thisChunkY = Math.floor(y / chunkSize)
    const thisChunkZ = Math.floor(z / chunkSize)

    const thisChunkPos = p.createVector(thisChunkX, thisChunkY, thisChunkZ)

    for (const chunk of chunks) {
      if (chunk.getPos().dist(thisChunkPos) === 0) {
        return
      }
    }

    chunks.push(new Chunk(p, { pos: thisChunkPos, size: chunkSize }))
  }

  render(x, y, z) {
    this.update(x, y, z)

    const { chunks } = this

    for (const chunk of chunks) {
      chunk.render()
    }
  }
}

class Chunk {
  constructor(p, props) {
    const { pos = p.createVector(0, 0, 0), size = 2048, seed = uuid() } = props

    this.p = p

    this.id = hash
      .sha256()
      .update(seed)
      .digest("hex")

    this.pos = pos
    this.center = p5.Vector.mult(pos, size)
    this.size = size

    this.clusters = []
    this.entities = []

    this.setup()

    console.log(`Generated new chunk with id ${this.id}`)
  }

  setup() {
    const { p, center, size } = this

    const weights = []
    const numWeights = 16
    for (let i = 0; i < numWeights; i += 1) {
      weights[i] = idHash(this.id, Math.floor((i / numWeights) * 20))
    }

    const density = weights[0] * 0.0015
    const numClusters = density * size
    for (let i = 0; i < numClusters; i += 1) {
      const cx = center.x + p.map(Math.random(), 0, 1, -size / 2, size / 2)
      const cy = center.y + p.map(Math.random(), 0, 1, -size / 2, size / 2)
      const cz = center.z + p.map(Math.random(), 0, 1, -size / 2, size / 2)

      if (Math.random() > weights[1]) {
        // cluster
        this.clusters.push(new Cluster(p, { pos: p.createVector(cx, cy, cz) }))
      } else {
        // individual entity
        this.entities.push(
          new Entity(p, {
            pos: p.createVector(cx, cy, cz)
          })
        )
      }
    }
  }

  render() {
    const { entities, clusters } = this

    for (const entity of entities) {
      entity.render()
    }

    for (const cluster of clusters) {
      cluster.render()
    }
  }

  getPos() {
    return this.pos
  }
}

class Cluster {
  constructor(p, props) {
    const {
      pos,
      numEntities = 10,
      seed = uuid(),
      fill = p.color(Math.random() * 360, 100, 60)
    } = props

    this.p = p

    this.id = hash
      .sha256()
      .update(seed)
      .digest("hex")

    this.pos = pos

    this.fill = fill

    this.numEntities = numEntities * idHash(this.id, 10)
    this.entities = []

    this.setup()
  }

  setup() {
    const { p, id, pos, numEntities, fill } = this

    const avgSize = idHash(id, 542) * 200
    const spread = idHash(id, 16) * avgSize + 200

    for (let i = 0; i < numEntities; i += 1) {
      const cx = pos.x + p.map(Math.random(), 0, 1, -spread / 2, spread / 2)
      const cy = pos.y + p.map(Math.random(), 0, 1, -spread / 2, spread / 2)
      const cz = pos.z + p.map(Math.random(), 0, 1, -spread / 2, spread / 2)

      const dHue = p.map(idHash(id, i), 0, 1, -12, 21)
      const dSat = p.map(idHash(id, i + 1), 0, 1, -3, 4)
      const dBrightness = p.map(idHash(id, i + 2), 0, 1, -14, 14)

      const cFill = p.color(
        p.hue(fill) + dHue,
        p.saturation(fill) + dSat,
        p.brightness(fill) + dBrightness
      )

      const size =
        avgSize +
        p.map(
          idHash(id, i),
          0,
          1,
          idHash(id, i + 30) * 20,
          idHash(id, i + 59) * 40
        )

      this.entities.push(
        new Entity(p, {
          size,
          pos: p.createVector(cx, cy, cz),
          fill: cFill
        })
      )
    }
  }

  render() {
    const { p, id, entities } = this
    for (const entity of entities) {
      const rx = p.sin(p.frameCount * 0.001 * idHash(id, 6)) * 5 * idHash(id, 2)
      const ry =
        p.sin(p.frameCount * 0.001 * idHash(id, 12)) * 5 * idHash(id, 1)
      const rz = p.sin(p.frameCount * 0.001 * idHash(id, 4)) * 5 * idHash(id, 3)
      entity.setOffsetRot(p.createVector(rx, ry, rz))
      entity.render()
    }
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
