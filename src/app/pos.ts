import { round } from "./util"

export class Pos {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z?: number,
  ) { }
  toString = () => `x: ${ round(this.x) } y: ${ round(this.y) }`
  subtract(pos: Pos) {
    return new Pos(this.x - pos.x, this.y - pos.y)
  }
  add(pos: Pos) {
    return new Pos(this.x + pos.x, this.y + pos.y)
  }
  scale(scale: number) {
    return new Pos(this.x * scale, this.y * scale)
  }
  get manhatDist() {
    return Math.abs(this.x) + Math.abs(this.y)
  }
  get abs() {
    return new Pos(Math.abs(this.x), Math.abs(this.y))
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
  equalTo(that: Pos) {
    return this.x === that.x && this.y === that.y
  }
  notEqualTo(that: Pos) {
    return !this.equalTo(that)
  }

}