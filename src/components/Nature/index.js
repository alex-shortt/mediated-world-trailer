import p5 from "p5"
import hash from "hash.js"
import uuid from "uuid/v4"

import Entity from "components/Entity"

export default class Nature {
  constructor(p, props) {
    const { seed = uuid(), chunkSize = 1990, renderDist = 3 } = props
    this.p = p

    this.id = hash
      .sha256()
      .update(seed)
      .digest("hex")

    this.chunks = []
    this.chunkSize = chunkSize

    this.renderDist = renderDist
    this.maxDist = distSquaredCoords(
      0,
      0,
      0,
      renderDist,
      renderDist,
      renderDist
    )

    console.log(`Generated Nature with id ${this.id}`)
  }

  update(pos) {
    const { chunkSize, renderDist } = this

    for (let dx = -renderDist; dx <= renderDist; dx += 1) {
      for (let dy = -renderDist; dy <= renderDist; dy += 1) {
        for (let dz = -renderDist; dz <= renderDist; dz += 1) {
          this.spawnChunkIfNew(
            pos.x + dx * chunkSize,
            pos.y + dy * chunkSize,
            pos.z + dz * chunkSize
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
      if (distSquared(chunk.getPos(), thisChunkPos) === 0) {
        return
      }
    }

    chunks.push(new Chunk(p, { pos: thisChunkPos, size: chunkSize }))
  }

  render(pos) {
    this.update(pos)

    const { chunks, chunkSize, maxDist } = this

    const chunkX = Math.floor(pos.x / chunkSize)
    const chunkY = Math.floor(pos.y / chunkSize)
    const chunkZ = Math.floor(pos.z / chunkSize)

    let count = 0
    for (const chunk of chunks) {
      const chunkPos = chunk.getPos()
      const distSq = distSquaredCoords(
        chunkPos.x,
        chunkPos.y,
        chunkPos.z,
        chunkX,
        chunkY,
        chunkZ
      )

      if (distSq < maxDist) {
        count += 1
        chunk.render()
      }
    }

    // console.log(`Rendered chunks ${count}/${chunks.length}`)
  }

  getChunks() {
    return this.chunks
  }

  setRenderDistance(newDist) {
    this.renderDist = newDist
    this.maxDist = distSquaredCoords(0, 0, 0, newDist, newDist, newDist)
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
    this.maxDensity = 0.00051

    this.clusters = []
    this.entities = []

    this.setup()

    console.log(`Generated new chunk with id ${this.id}`)
  }

  setup() {
    const { p, maxDensity, center, size } = this

    const weights = []
    const numWeights = 16
    for (let i = 0; i < numWeights; i += 1) {
      weights[i] = idHash(this.id, Math.floor((i / numWeights) * 20))
    }

    const density = maxDensity
    const numClusters = Math.floor(density * size)
    for (let i = 0; i < numClusters; i += 1) {
      const cx = center.x + p.map(Math.random(), 0, 1, -size / 2, size / 2)
      const cy = center.y + p.map(Math.random(), 0, 1, -size / 2, size / 2)
      const cz = center.z + p.map(Math.random(), 0, 1, -size / 2, size / 2)

      if (Math.random() > weights[1] * 1.2) {
        // cluster
        this.clusters.push(new Cluster(p, { pos: p.createVector(cx, cy, cz) }))
      } else {
        // individual entity
        this.entities.push(
          new Entity(p, {
            size: idHash(this.id, 90) * 150 + 35,
            pos: p.createVector(cx, cy, cz)
          })
        )
      }
    }
  }

  render() {
    const { p, id, center, size, entities, clusters } = this

    // p.push()
    // p.translate(center)
    // p.strokeWeight(3)
    // p.fill(idHash(id, 10) * 360, 100, 80, 30)
    // p.box(size)
    // p.pop()

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

  getClusters() {
    return this.clusters
  }
}

class Cluster {
  constructor(p, props) {
    const {
      pos,
      numEntities = 8,
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

    this.weights = []
    const numWeights = 6
    for (let i = 0; i < numWeights * 4; i += 1) {
      this.weights[i] = idHash(this.id, i)
    }

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
    const { p, id, entities, weights } = this

    const w1 = weights[0]
    const w2 = weights[1]
    const w3 = weights[2]

    for (const entity of entities) {
      const rx = Math.sin(p.millis() * 0.0001 * w1) * 2.5 * w3
      const ry = Math.sin(p.millis() * 0.0001 * w2) * 2.5 * w1
      const rz = Math.sin(p.millis() * 0.0001 * w3) * 2.5 * w2
      entity.setOffsetRot(p.createVector(rx, ry, rz))
      entity.render()
    }
  }

  getPos() {
    return this.pos
  }
}

function distSquared(vec1, vec2) {
  return Math.sqrt(
    Math.pow(vec1.x - vec2.x, 2) +
      Math.pow(vec1.y - vec2.y, 2) +
      Math.pow(vec1.z - vec2.z, 2)
  )
}

function distSquaredCoords(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  )
}

function idHash(id, val) {
  const pos = val % (id.length - 1)
  const length = 2

  return (
    parseInt((id + id).substring(pos, pos + length), 16) /
    (Math.pow(16, length) - 1)
  )
}
