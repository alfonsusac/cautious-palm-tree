import { Pos } from "./pos"
import { round } from "./util"

export class Rect {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) { }
  get left() { return this.x }
  get top() { return this.y }
  get right() { return this.x + this.width }
  get bottom() { return this.y + this.height }
  isIntersecting(rect2: Rect) {
    return (this.left < rect2.right &&
      this.right > rect2.left &&
      this.top < rect2.bottom &&
      this.bottom > rect2.top)
  }
  isInsideOf(rect2: Rect) {
    return (this.left >= rect2.left &&
      this.right <= rect2.right &&
      this.top >= rect2.top &&
      this.bottom <= rect2.bottom)
  }
  toString() {
    return `xy(${ round(this.x) }, ${ round(this.y) }) wh(${ round(this.width) }, ${ round(this.height) })`
  }

  static fromDOMRect(rect: DOMRect) {
    return new Rect(rect.x, rect.y, rect.width, rect.height)
  }
  static fromPos(pos1: Pos, pos2: Pos) {
    const rect = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
    // Determine top and bottom coordinates
    if (pos1.y <= pos2.y) {
      rect.top = pos1.y
      rect.bottom = pos2.y
    } else {
      rect.top = pos2.y
      rect.bottom = pos1.y
    }
    // Determine left and right coordinates
    if (pos1.x <= pos2.x) {
      rect.left = pos1.x
      rect.right = pos2.x
    } else {
      rect.left = pos2.x
      rect.right = pos1.x
    }
    return new Rect(
      rect.left,
      rect.top,
      rect.right - rect.left,
      rect.bottom - rect.top
    )
  }
}

// export type Rect = {
//   left: number,
//   right: number,
//   top: number,
//   bottom: number,
// }

// export function createRect(pos1: Pos, pos2: Pos) {
//   const rect = {
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0
//   }
//   // Determine top and bottom coordinates
//   if (pos1.y <= pos2.y) {
//     rect.top = pos1.y
//     rect.bottom = pos2.y
//   } else {
//     rect.top = pos2.y
//     rect.bottom = pos1.y
//   }
//   // Determine left and right coordinates
//   if (pos1.x <= pos2.y) {
//     rect.left = pos1.x
//     rect.right = pos2.y
//   } else {
//     rect.left = pos2.y
//     rect.right = pos1.x
//   }
//   return rect
// }

// export function isIntersecting(
//   rect1: Rect,
//   rect2: Rect,
// ) {
//   return (rect1.left < rect2.right &&
//     rect1.right > rect2.left &&
//     rect1.top < rect2.bottom &&
//     rect1.bottom > rect2.top)
// }

// export function isInside(
//   rect1: Rect,
//   rect2: Rect,
// ) {
//   return (rect1.left >= rect2.left &&
//     rect1.right <= rect2.right &&
//     rect1.top >= rect2.top &&
//     rect1.bottom <= rect2.bottom)
// }