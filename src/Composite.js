import Particle from "./Particle";
import { DistanceConstraint, PinConstraint } from "./Constraint";
import Vector2 from "./Vector2";

export class Composite {
  constructor() {
    this.particles = [];
    this.constraints = [];
  }

  applyConstraint(stepCoef) {
    for (const constraint of this.constraints) {
      constraint.applyConstraint(stepCoef);
    }
  }

  pin(index) {
    this.constraints.push(new PinConstraint(this.particles[index]));
  }

  draw(context) {
    for (const constraint of this.constraints) {
      constraint.draw(context);
    }

    for (const particle of this.particles) {
      particle.draw(context);
    }
  }
}

export class Point extends Composite {
  constructor(position) {
    super();
    this.particles.push(new Particle(position));
  }
}

export class Line extends Composite {
  constructor(startPoint, endPoint, numParticles, stiffness) {
    super();

    const v = endPoint.sub(startPoint);
    const segments = numParticles - 1;
    const step = v.divide(segments);

    for (let i = 0; i < numParticles; ++i) {
      this.particles.push(new Particle(startPoint.add(step.multiply(i))));
    }

    for (let i = 0; i < segments; ++i) {
      this.constraints.push(
        new DistanceConstraint(
          this.particles[i],
          this.particles[i + 1],
          stiffness
        )
      );
    }
  }

  pinFirst() {
    this.pin(0);
  }

  pinLast() {
    this.pin(this.particles.length - 1);
  }
}

export class Circle extends Composite {
  constructor(center, radius, segments, spokeStiffness, treadStiffness) {
    super();

    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; ++i) {
      const theta = angleStep * i;
      this.particles.push(
        new Particle(
          center.add(
            new Vector2(Math.cos(theta) * radius, Math.sin(theta) * radius)
          )
        )
      );
    }

    const centerParticle = new Particle(center);

    for (let i = 0; i < segments; ++i) {
      const a = this.particles[i];
      const b = this.particles[(i + 1) % segments];
      const c = this.particles[(i + 5) % segments];
      this.constraints.push(new DistanceConstraint(a, b, treadStiffness));
      this.constraints.push(new DistanceConstraint(a, c, treadStiffness));
      this.constraints.push(
        new DistanceConstraint(a, centerParticle, spokeStiffness)
      );
    }

    this.particles.push(centerParticle);
  }
}
