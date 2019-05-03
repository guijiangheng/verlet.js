import {
  ParticleSystem,
  Line,
  Vector2,
  Circle,
  CanvasRenderer,
  BoxConstraint,
  DirectionalForce,
  Point
} from "../src/index";

import "./styles.css";

const system = new ParticleSystem();

const box = new BoxConstraint(0, 0, window.innerWidth, window.innerHeight);
system.addConstraint(box);

const gravity = new DirectionalForce(new Vector2(0, 0.3));
system.addForce(gravity);

const point = new Point(new Vector2(700, 50));
system.addComposite(point);

const line = new Line(new Vector2(20, 10), new Vector2(100, 10), 5, 0.02);
line.pinFirst();
line.pinLast();
system.addComposite(line);

const circle1 = new Circle(new Vector2(200, 50), 50, 30);
const circle2 = new Circle(new Vector2(400, 50), 70, 7);
const circle3 = new Circle(new Vector2(600, 50), 70, 3);

system.addComposite(circle1);
system.addComposite(circle2);
system.addComposite(circle3);

const renderer = new CanvasRenderer(system);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

(function animate() {
  requestAnimationFrame(animate);
  system.frame(16);
  renderer.render();
})();

window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  box.setSize(0, 0, window.innerWidth, window.innerHeight);
};
