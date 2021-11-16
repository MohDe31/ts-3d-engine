import { Vec3, vec3Normalize, vec3xVec3Sub } from "../utils/vecUtils";
import Mesh from "./mesh";
import { Triangle } from "./triangle";

export class Cube extends Mesh {
    
    constructor();
    constructor(resolution);
    constructor(resolution, position);
    constructor(resolution, position, rotation);
    constructor(resolution: number = 1, position: Vec3 = {x:0, y:0, z:0}, rotation: Vec3 = {x:0, y:0, z:0}) {
        super(position, rotation);

        let step = 1 / resolution;

        for(let i = 0; i < resolution; i+=1)
        for(let j = 0; j < resolution; j+=1) {
            this.triangles.push(
                //TOP
                new Triangle({x: step * i, y: 1, z: step * j}, {x: step * i, y: 1, z: step + step * j}, {x: step + step * i, y: 1, z: step * j}),
                new Triangle({x: step * i, y: 1, z: step + step * j}, {x: step + step * i, y: 1, z: step + step * j}, {x: step + step * i, y: 1, z: step * j}),
                //BOTTOM
                new Triangle({x: step + step * i, y: 0, z: step * j}, {x: step * i, y: 0, z: step + step * j}, {x: step * i, y: 0, z: step * j}),
                new Triangle({x: step + step * i, y: 0, z: step * j}, {x: step + step * i, y: 0, z: step + step * j}, {x: step * i, y: 0, z: step + step * j}),
                //LEFT
                new Triangle({x: 0, y: step * i, z: step * j}, {x: 0, y: step * i, z: step + step * j}, {x: 0, y: step + step * i, z: step * j}),
                new Triangle({x: 0, y: step * i, z: step + step * j}, {x: 0, y: step + step * i, z: step + step * j}, {x: 0, y: step + step * i, z: step * j}),
                //RIGHT
                new Triangle({x: 1, y: step * i, z: step * j}, {x: 1, y: step + step * i, z: step * j}, {x: 1, y: step * i, z: step + step * j}),
                new Triangle({x: 1, y: step + step * i, z: step * j}, {x: 1, y: step + step * i, z: step + step * j}, {x: 1, y: step * i, z: step + step * j}),
                //FRONT
                new Triangle({x: step * i, y: step * j, z: 1}, {x: step + step * i, y: step * j, z: 1}, {x: step * i, y: step + step * j, z: 1}),
                new Triangle({x: step + step * i, y: step * j, z: 1}, {x: step + step * i, y: step + step * j, z: 1}, {x: step * i, y: step + step * j, z: 1}),
                //BACK
                new Triangle({x: step * i, y: step * j, z: 0}, {x: step * i, y: step + step * j, z: 0}, {x: step + step * i, y: step * j, z: 0}),
                new Triangle({x: step * i, y: step + step * j, z: 0}, {x: step + step * i, y: step + step * j, z: 0}, {x: step + step * i, y: step * j, z: 0}), 
            );
        }

        for(let i = 0; i < this.triangles.length; i+=1) {
            vec3xVec3Sub(this.triangles[i].points[0], {x: .5, y: .5, z: .5});
            vec3xVec3Sub(this.triangles[i].points[1], {x: .5, y: .5, z: .5});
            vec3xVec3Sub(this.triangles[i].points[2], {x: .5, y: .5, z: .5});
        }
    }

}


export class Sphere extends Cube {

    constructor();
    constructor(resolution);
    constructor(resolution, position);
    constructor(resolution, position, rotation);
    constructor(resolution: number = 1, position: Vec3 = {x:0, y:0, z:0}, rotation: Vec3 = {x:0, y:0, z:0}) {
        super(resolution, position, rotation);

        for(let i = 0; i < this.triangles.length; i+=1) {
            vec3Normalize(this.triangles[i].points[0]);
            vec3Normalize(this.triangles[i].points[1]);
            vec3Normalize(this.triangles[i].points[2]);
        }
    }
}