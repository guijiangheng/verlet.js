export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(k) {
    return new Vector2(this.x * k, this.y * k);
  }

  divide(k) {
    return this.multiply(1 / k);
  }

  normalize() {
    return this.divide(this.length());
  }

  distanceSquared(v) {
    return this.sub(v).lengthSquared();
  }

  distance(v) {
    return this.sub(v).length();
  }

  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.lengthSquared());
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}
