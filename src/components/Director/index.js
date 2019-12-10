export default class Director {
  constructor(p, props) {
    this.p = p
    this.events = []
    this.offset = p.millis()
  }

  addTriggerEvent(time, callback) {
    this.events.push(new TriggerEvent(time * 1000, callback))
  }

  addDurationEvent(start, stop, callback) {
    this.events.push(new DurationEvent(start * 1000, stop * 1000, callback))
  }

  render() {
    const { p, events, offset } = this

    for (const event of events) {
      event.trigger(p.millis() - offset)
    }
  }

  getTime() {
    const { p, offset } = this
    return p.millis() - offset
  }

  setOffset() {
    const { p } = this
    this.offset = p.millis()
  }
}

class DurationEvent {
  constructor(start, stop, callback) {
    this.start = start
    this.stop = stop
    this.callback = callback
  }

  trigger(currTime) {
    const { start, stop, callback } = this
    if (currTime > start && currTime < stop) {
      callback.apply(null, [currTime, start, stop, stop - start])
    }
  }
}

class TriggerEvent {
  constructor(time, callback) {
    this.called = false
    this.time = time
    this.callback = callback
  }

  trigger(currTime) {
    const { time, called } = this
    if (currTime > time && !called) {
      this.callback.apply(null, [currTime / 1000, time])
      this.called = true
    }
  }
}
