import { Vec3, vec3Normalize, vec3xVec3Sub } from "../utils/vecUtils";
import GameObject from "./gameobject";
import { Triangle } from "./triangle";

// Resolution is how many squares a face contains
/**
 * e.i
 * resolution = 1
 * _________
 * |        |
 * |        |
 * |        |
 * ----------
 * 
 * resolution = 2
 * 
 * ___________
 * |    |    |
 * |----|----|
 * |    |    |
 * -----------
 * 
 */
export function cubeTriangles(resolution: number): Array<Triangle> {

    const triangles: Array<Triangle> = new Array<Triangle>();

    let step = 1 / resolution;

    for(let i = 0; i < resolution; i+=1)
    for(let j = 0; j < resolution; j+=1) {
        triangles.push(
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

    for(let i = 0; i < triangles.length; i+=1) {
        vec3xVec3Sub(triangles[i].points[0], {x: .5, y: .5, z: .5});
        vec3xVec3Sub(triangles[i].points[1], {x: .5, y: .5, z: .5});
        vec3xVec3Sub(triangles[i].points[2], {x: .5, y: .5, z: .5});
    }

    return triangles;
}


// A sphere is just a cube normalized
export function sphereTriangles(resolution: number): Array<Triangle> {

    const triangles: Array<Triangle> = cubeTriangles(resolution);

    for(let i = 0; i < triangles.length; i+=1) {
        vec3Normalize(triangles[i].points[0]);
        vec3Normalize(triangles[i].points[1]);
        vec3Normalize(triangles[i].points[2]);
    }

    return triangles;
}

export function quadTriangles(resolution: number): Array<Triangle> {

    const triangles: Array<Triangle> = new Array<Triangle>();

    let step = 1 / resolution;

    for(let i = 0; i < resolution; i+=1)
    for(let j = 0; j < resolution; j+=1) {
        triangles.push(
            //TOP
            new Triangle({x: step * i, y: 0, z: step * j}, {x: step * i, y: 0, z: step + step * j}, {x: step + step * i, y: 0, z: step * j}),
            new Triangle({x: step * i, y: 0, z: step + step * j}, {x: step + step * i, y: 0, z: step + step * j}, {x: step + step * i, y: 0, z: step * j}),
        );
    }

    for(let i = 0; i < triangles.length; i+=1) {
        vec3xVec3Sub(triangles[i].points[0], {x: .5, y: 0, z: .5});
        vec3xVec3Sub(triangles[i].points[1], {x: .5, y: 0, z: .5});
        vec3xVec3Sub(triangles[i].points[2], {x: .5, y: 0, z: .5});
    }

    return triangles;
}


export function circleTriangles(resolution: number): Array<Triangle> {

    const triangles: Array<Triangle> = quadTriangles(resolution);

    for(let i = 0; i < triangles.length; i+=1) {
        vec3Normalize(triangles[i].points[0]);
        vec3Normalize(triangles[i].points[1]);
        vec3Normalize(triangles[i].points[2]);
    }

    return triangles;
}