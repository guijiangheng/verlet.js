export default class ParticleSystem {
  constructor() {
    this.friction = 0.99;
    this.forces = [];
    this.composites = [];
    this.constraints = [];
  }

  addForce(force) {
    this.forces.push(force);
  }

  addComposite(composite) {
    this.composites.push(composite);
  }

  addConstraint(constraint) {
    this.constraints.push(constraint);
  }

  frame(step) {
    for (const composite of this.composites) {
      for (const particle of composite.particles) {
        const velocity = particle.getVelocity().multiply(this.friction);
        particle.prevPosition = particle.position;
        particle.position = particle.position.add(velocity);
        for (const force of this.forces) {
          force.applyForce(particle);
        }
      }
    }

    const stepCoef = 1 / step;

    for (let i = 0; i < step; ++i) {
      for (const composite of this.composites) {
        composite.applyConstraint(stepCoef);
      }
    }

    for (const composite of this.composites) {
      for (const particle of composite.particles) {
        for (const constraint of this.constraints) {
          constraint.applyConstraint(particle);
        }
      }
    }
  }
}
