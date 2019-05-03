import Vector2 from "./Vector2";
import { PinConstraint } from "./Constraint";

export default class CanvasRenderer {
  constructor(system) {
    this.system = system;
    this.dragEntity = null;
    this.mouse = new Vector2();
    this.highlightColor = "#4f545c";
    this.domElement = document.createElement("canvas");
    this.context = this.domElement.getContext("2d");
    this.setSize(400, 300);
    this.addListeners();
  }

  setSize(width, height) {
    this.width = this.domElement.width = width;
    this.height = this.domElement.height = height;
  }

  getNearestEntity() {
    const selectRadius = 20;
    let nearestParticle = null;
    let nearestConstraints = null;
    let nearestDistSuqred = Infinity;

    for (const composite of this.system.composites) {
      for (const particle of composite.particles) {
        const d2 = particle.position.distanceSquared(this.mouse);
        if (d2 < selectRadius * selectRadius && d2 < nearestDistSuqred) {
          nearestParticle = particle;
          nearestDistSuqred = d2;
          nearestConstraints = composite.constraints;
        }
      }
    }

    // if particle is pinned, return pinned constraint instead
    if (nearestConstraints) {
      for (const constraint of nearestConstraints) {
        if (
          constraint instanceof PinConstraint &&
          constraint.particle === nearestParticle
        ) {
          return constraint;
        }
      }
    }

    return nearestParticle;
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);

    for (const composite of this.system.composites) {
      composite.draw(this.context);
    }

    const entity = this.dragEntity || this.getNearestEntity();

    if (entity) {
      this.context.beginPath();
      this.context.arc(entity.position.x, entity.position.y, 8, 0, 2 * Math.PI);
      this.context.strokeStyle = this.highlightColor;
      this.context.stroke();
    }

    if (this.dragEntity) {
      this.dragEntity.position = this.mouse;
    }
  }

  addListeners() {
    this.domElement.onmousemove = e => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
    };

    this.domElement.onmousedown = e => {
      this.dragEntity = this.getNearestEntity();
    };

    this.domElement.onmouseup = () => {
      this.dragEntity = null;
    };
  }
}
