import Vector2 from "./Vector2";

export class Force {
  applyForce(particle) {
    throw new Error("subclass must overload this method");
  }
}

export class DirectionalForce extends Force {
  constructor(force = new Vector2()) {
    super();
    this.force = force;
  }

  applyForce(particle) {
    particle.position = particle.position.add(this.force);
  }
}
