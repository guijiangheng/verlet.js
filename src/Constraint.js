export class Constraint {
  applyConstraint(stepCoef) {
    throw new Error("subclass must overload this method");
  }

  draw(context) {
    // default draw nothing
  }
}

export class DistanceConstraint extends Constraint {
  constructor(particleA, particleB, stiffness, distance) {
    super();
    this.particleA = particleA;
    this.particleB = particleB;
    this.stiffness = stiffness;
    this.distance =
      typeof distance === "undefined"
        ? particleA.position.sub(particleB.position).length()
        : distance;
  }

  applyConstraint(stepCoef) {
    const { particleA, particleB } = this;
    const v = particleA.position.sub(particleB.position);
    const length = v.length();
    const k = (length - this.distance) / length / 2;
    const offset = v.multiply(k);
    particleA.position = particleA.position.sub(offset);
    particleB.position = particleB.position.add(offset);
  }

  draw(context) {
    const { particleA, particleB } = this;
    context.beginPath();
    context.moveTo(particleA.position.x, particleA.position.y);
    context.lineTo(particleB.position.x, particleB.position.y);
    context.strokeStyle = "#d8dde2";
    context.stroke();
  }
}

export class PinConstraint extends Constraint {
  constructor(particle, position) {
    super();
    this.particle = particle;
    this.position =
      typeof position === "undefined" ? particle.position.clone() : position;
  }

  applyConstraint(stepCoef) {
    this.particle.position = this.position.clone();
  }

  draw(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, 6, 0, 2 * Math.PI);
    context.fillStyle = "rgba(0, 153, 255, 0.1)";
    context.fill();
  }
}

export class BoxConstraint extends Constraint {
  constructor(x, y, width, height, friction = 1) {
    super();
    this.friction = friction;
    this.setSize(x, y, width, height);
  }

  setSize(x, y, width, height) {
    this.minX = x;
    this.minY = y;
    this.maxX = x + width;
    this.maxY = y + height;
  }

  applyConstraint(particle) {
    const velocity = particle.getVelocity();

    if (particle.position.x < this.minX) {
      particle.position.x = this.minX;
      particle.prevPosition.x = this.minX + velocity.x * this.friction;
    } else if (particle.position.x > this.maxX) {
      particle.position.x = this.maxX;
      particle.prevPosition.x = this.maxX + velocity.x * this.friction;
    }

    if (particle.position.y < this.minY) {
      particle.position.y = this.minY;
      particle.prevPosition.y = this.minY + velocity.y * this.friction;
    } else if (particle.position.y > this.maxY) {
      particle.position.y = this.maxY;
      particle.prevPosition.y = this.maxY + velocity.y * this.friction;
    }
  }

  draw(context) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#4f545c";
    context.strokeRect(
      this.minX,
      this.minY,
      this.maxX - this.minX,
      this.maxY - this.minY
    );
    context.stroke();
  }
}
