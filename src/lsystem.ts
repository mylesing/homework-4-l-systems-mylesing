import Dictionary from './dictionary';
import Turtle from './turtle';
import {vec3, vec4, mat4} from 'gl-matrix';
import Cube from './geometry/Cube';
import Mesh from './geometry/Mesh';
import Icosphere from './geometry/Icosphere';
import {main} from './main';
import Drawable from './rendering/gl/Drawable';

// Rulebook
var rules = new Dictionary();
rules.Add('X', 'FF[−XYS]FFF[XYS][−XS]+XYS');
rules.Add('F', 'F[XYS]');
rules.Add('+', 'F[+YS]FFF[XYS][−XS]+XYS');
rules.Add('-', 'F[-YS]FFF[XYS][−XS]+XYS');
rules.Add('B', 'B');

// L-system class
export class LSystem {
    // member variables
    str : String;           // l-system string
    expandStr : String;           // l-system string
    currTurtle : Turtle;    // current turtle storing position and rotation
    tStack : Turtle[];         // initially empty stack to hold turtles
    structure : Cube;       // cube structure
    foliage : Mesh;
    
    constructor(str : String) {
        this.str = str;
        this.expandStr = str;
        this.currTurtle = new Turtle(vec3.fromValues(0, -10, -2), mat4.create());
        this.structure = new Cube(vec3.fromValues(0, -10, -2));
        this.foliage = new Mesh(vec3.fromValues(0, -2, -2));
        this.tStack = [];
    }

    draw() {
        console.log(this.expandStr);
        // go through each character in the string and update the turtle

        // count for cubes and spheres
        var count = 1;
        var sCount = 1;

        // size increment
        var sizeInc = 1;
        var sphereSize = 0.05;

        // initialize foliage
        this.foliage = new Mesh(vec3.fromValues(0,0,0));
        this.foliage.loadBuffers('sphere.obj');

        // go through the string 
        for (let i = 0; i < this.expandStr.length; ++i) {
            // tree base
             var curr = this.expandStr.charAt(i);
            if (i < 5) {
                sizeInc = (7 - i) / 2.0;
            } else {
                sizeInc = 1;
                if (sizeInc < 1) {
                    sizeInc = 1;
                }
            }

            // draw cube at position and orientation of current turtle 
            this.structure.addPositions(this.currTurtle.turtlePos, sizeInc);

            // current character
            var dir;
            if (curr == 'X') {
                // move in random x z direction
                var r3 = Math.round(Math.random());
                var r4 = Math.round(Math.random());

                // uhhhh let's not have any 0s lol
                if (r3 == 0) {
                    r3 = -1;
                } 

                if (r4 == 0) {
                    r4 = -1;
                }

                dir = vec3.fromValues(r3 * 0.2 * sizeInc, 0, r4 * 0.2 * sizeInc);
                this.currTurtle.translate(dir);
                count++;

            } else if (curr == 'F'){
                // grow upwards
                this.currTurtle.translate(vec3.fromValues(0, 0.2 * (sizeInc - 0.5), 0));
                count++;

            } else if (curr == 'Y') {
                // continue moving in the direction that X moved in
                var inc = Math.random() * 5.0 + 3;
                var tempSize = sizeInc;
                for (let j = 0; j < inc; j++) {
                    this.currTurtle.translate(vec3.fromValues(dir[0], Math.random() * 0.15 * tempSize, dir[2]));
                    this.structure.addPositions(this.currTurtle.turtlePos, tempSize);
                    tempSize -= 0.01;
                    count++;
                }

            } else if (curr == '+') {
                // move +ive x
                dir = vec3.fromValues(0.20 * sizeInc, 0, 0);
                this.currTurtle.translate(dir);
                count++;

            } else if (curr == '-') {
                // move -ive x
                dir = vec3.fromValues(-0.20 * sizeInc, 0, 0);
                this.currTurtle.translate(dir);
                count++;

            } else if (curr == 'S') {
                // draw sphere at position
                this.foliage.addPositions(this.currTurtle.turtlePos, sphereSize * (Math.random() + 0.5));
                sCount++;

            } else if (curr == 'B') {
                // draw base
                this.currTurtle.translate(vec3.fromValues(0, 0.2 * (sizeInc - 0.5), 0));
                count++;

            } else if (curr == '[') {
                // push onto stack
                let pos = vec3.fromValues(this.currTurtle.turtlePos[0], this.currTurtle.turtlePos[1], this.currTurtle.turtlePos[2]);
                var newTurt = new Turtle(pos, mat4.create());
                this.tStack.push(newTurt);
                continue;

            } else if (curr == ']') {
                // go back to turtle positon and rotation on stack
                this.currTurtle = this.tStack.pop();
                continue;
            }

        }
        // last cube
        this.structure.addPositions(this.currTurtle.turtlePos, sizeInc);

        // create normals for the len
        this.structure.setNormals(count);
        this.foliage.setNormals(sCount);

        // create
        this.structure.setIdx(count);
        this.foliage.setIdx(sCount);
    }

    expand(count : number) {
        for(let n = 0; n < count; ++n) {
            var newStr = '';
            for(let i = 0; i < this.expandStr.length; ++i) {
                if(rules.ContainsKey(this.expandStr.charAt(i))) {
                    newStr = newStr + rules.Item(this.expandStr.charAt(i));
                }
            }
            this.expandStr = newStr;
        }
    }

    reset() {
        this.expandStr = this.str;
        this.currTurtle = new Turtle(vec3.fromValues(0, -2, -2), mat4.create());
        this.structure = new Cube(vec3.fromValues(0, -2, -2));
        this.foliage = new Mesh(vec3.fromValues(0, -2, -2));
        this.tStack = [];
    }
}



export default LSystem;