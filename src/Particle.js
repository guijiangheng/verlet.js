import Vector2 from "./Vector2";

export default class Particle {
  constructor(position = new Vector2(), prevPosition = position) {
    this.position = position;
    this.prevPosition = prevPosition;
  }

  getVelocity() {
    return this.position.sub(this.prevPosition);
  }

  setVelocity(v) {
    this.prevPosition = this.position.sub(v);
  }

  draw(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
    context.fillStyle = "#2dad8f";
    context.fill();
  }
}
