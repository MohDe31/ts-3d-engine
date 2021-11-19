import Scene from "./scene";
import { Cube, Sphere } from "./graphics/primitive";
import { parseObj } from "./utils/objParser";
import { join } from "path";
import { Light } from "./graphics/light";
import { Camera } from "./graphics/camera";
import Mesh from "./graphics/mesh";
import { Triangle } from "./graphics/triangle";
import Renderer from "./renderer";

window.onload = function () {
    const scene : Scene = new Scene();

    const floor : Mesh = new Mesh();
    const table : Mesh = parseObj(join(__dirname, "/assets/bill-table.obj"));
    const balls : Array<Mesh> = new Array<Mesh>();

    for(let i = 0; i < 5; i+=1)
    for(let j = 0; j < 5 - i; j+=1)
    {
        balls.push(new Sphere(8, {
            x: j + .5 * i,
            y: 5,
            z: i * 2
        }));
    }
    

    const FLOORX: number = 25;
    const FLOORY: number = 25;

    const triangles: Array<Triangle> = [];
    for(let i = 0; i < FLOORX; i+=1)
    for(let j = 0; j < FLOORY; j+=1) {
        let c_ = (i+j)%2 == 1 ? 255 : 0;
        triangles.push(
            new Triangle({x: i + 1, y: 0, z: j + 1}, {x: i + 1, y: 0, z: j}, {x: i, y: 0, z: j}, {r: c_, g: c_, b: c_}),
            new Triangle({x: i, y: 0, z: j + 1}, {x: i + 1, y: 0, z: j + 1}, {x: i, y: 0, z: j}, {r: c_, g: c_, b: c_}),
        )
    }

    floor.setTriangles(triangles);
    
    
    table.position = {x: ((FLOORX / 2) >> 0), y: 1, z: ((FLOORY / 2) >> 0)};

    scene.meshes.push(...balls);
    scene.meshes.push(table );
    scene.meshes.push(floor );

    scene.camera = new Camera(scene, {x: ((FLOORX / 2) >> 0), y: 4.5, z: ((FLOORY / 2) >> 0) - 4.5}, {x: Math.PI / 4, y: 0, z: 0});
    scene.lights.push(new Light(1, {x: 0,y: 0, z: 0}, {x: Math.PI / 4, y: 0, z: 0}));//{x: Math.PI / 2, y: 0, z: 0}));


    const renderer = new Renderer(scene, "app", { showfps: true });
};
