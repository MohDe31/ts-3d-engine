import Scene from "./scene";
import ContextRenderer from "./contextRenderer";
import { Cube, Sphere } from "./graphics/primitive";
import { parseObj } from "./utils/objParser";
import { join } from "path";
import { Light } from "./graphics/light";
import { Camera } from "./graphics/camera";
import { Vec3 } from "./utils/vecUtils";

window.onload = function () {
    const scene = new Scene();
    scene.meshes.push(parseObj(join(__dirname, "/assets/matCube.obj")));

    const rot: Vec3 = {x: 0, y: 0, z: 0}; 

    scene.camera = new Camera(scene, {x: 0, y: 0, z: -15}, rot);
    scene.lights.push(new Light(1, {x: 0,y: 1, z: 0}, rot));

    // scene.meshes.push(new Cube(8));
    // scene.meshes.push(new Sphere(8, {x: 5, y: 0, z: 0}));

    const renderer = new ContextRenderer(scene, "app", { showfps: true });
    //const renderer = new Renderer(scene, "app", { showfps: true });
};
