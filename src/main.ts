import { vec3, vec4 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Drawable from './rendering/gl/Drawable';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import Mesh from './geometry/Mesh';
import Icosphere from './geometry/Icosphere';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import LSystem from './lsystem';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentiall
  // color parameter
  treeColor: [127.0, 127.0, 127.0, 1.0], // RGBA values
  bubbleColor: [255.0, 0.0, 127.0, 1.0], // RGBA values
  expand: 0,
};

// meshes
let square: Square;
let cube: Cube;
let spheres: Mesh;

// lsystem
let lsystem: LSystem = new LSystem('BBBBBBB[XYS]F[XYS]F[+YS]FF[-YS]F[XYS]FF[XYS]');

// OBJ loader
var OBJ = require('webgl-obj-loader');

function loadScene() {
  // generate plane
  square.create();

  // reset el systema
  lsystem.reset();

  // initial call to load scene
  lsystem.expand(controls.expand);

  // re-draw and re-create
  lsystem.draw();
  cube = lsystem.structure;
  spheres = lsystem.foliage;
  cube.create();
  spheres.create();

}

let time: number;
time = 0;

export function main() {
  //const cubes = lsystem.draw();

  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  // adding color control to GUI
  gui.addColor(controls, 'treeColor');
  gui.addColor(controls, 'bubbleColor');
  gui.add(controls, 'expand', 0, 5).step(1);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  square = new Square(vec3.fromValues(0, 0, 0));

  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  var renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.3, 1.0, 0.7, 1);
  gl.enable(gl.DEPTH_TEST);

  // store current color
  let treeCol: vec4;
  let bubbCol: vec4;

  let shader: ShaderProgram;
  shader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/tree-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/tree-frag.glsl')),
  ]);

  let cloudShader: ShaderProgram;
  cloudShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/cloud-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/cloud-frag.glsl')),
  ]);

  let ground: ShaderProgram;
  ground = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);


  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    renderer.clear();
    // set time
    //console.log(`time = ` + time);
    shader.setTime(time);
    ground.setTime(time);
    cloudShader.setTime(time++);
    // set color 
    treeCol = vec4.fromValues(controls.treeColor[0] / 255.0, controls.treeColor[1] / 255.0, controls.treeColor[2] / 255.0, 1.0);
    bubbCol = vec4.fromValues(controls.bubbleColor[0] / 255.0, controls.bubbleColor[1] / 255.0, controls.bubbleColor[2] / 255.0, 1.0);
    shader.setGeometryColor(treeCol);
    ground.setGeometryColor(treeCol);
    cloudShader.setGeometryColor(bubbCol);

    // render tree
    renderer.render(camera, shader, [
      cube,
    ]);

    // render bubbles
    renderer.render(camera, cloudShader, [
      spheres,
    ]);

    renderer.render(camera, ground, [
      square,
    ]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
