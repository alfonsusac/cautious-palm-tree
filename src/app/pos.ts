export class Pos {
  constructor(
    readonly x: number,
    readonly y: number
  ) { }
  toString = () => `x: ${ this.x } y: ${ this.y }`
  subtract(pos: Pos) {
    return new Pos(this.x - pos.x, this.y - pos.y)
  }
  add(pos: Pos) {
    return new Pos(this.x + pos.x, this.y + pos.y)
  }
  scalar(scale: number) {
    return new Pos(this.x * scale, this.y * scale)
  }
  zero() {
    return this.x === 0 && this.y === 0
  }
  static fromObject(pos: { x: number, y: number }) {
    return new Pos(pos.x, pos.y)
  }
  get tuple() {
    return [this.x, this.y] as const
  }
  get isZero() {
    return this.x === 0 && this.y === 0
  }
}

export class Rectangle {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {
    
  }
}