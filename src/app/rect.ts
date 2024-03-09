import { Pos } from "./pos"

export type Rect = {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

export function createRect(pos1: Pos, pos2: Pos) {
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
  if (pos1.x <= pos2.y) {
    rect.left = pos1.x
    rect.right = pos2.y
  } else {
    rect.left = pos2.y
    rect.right = pos1.x
  }
  return rect
}

export function isIntersecting(
  rect1: Rect,
  rect2: Rect,
) {
  return (rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top)
}

export function isInside(
  rect1: Rect,
  rect2: Rect,
) {
  return (rect1.left >= rect2.left &&
    rect1.right <= rect2.right &&
    rect1.top >= rect2.top &&
    rect1.bottom <= rect2.bottom)
}