import Scene from "./scene";
import ContextRenderer from "./contextRenderer";
import { Cube, Sphere } from "./graphics/primitive";
import { parseObj } from "./utils/objParser";
import { join } from "path";

window.onload = function () {
    const scene = new Scene();
    scene.meshes.push(parseObj(join(__dirname, "/assets/katana.obj")));

    // scene.meshes.push(new Cube(8));
    // scene.meshes.push(new Sphere(8, {x: 5, y: 0, z: 0}));

    const renderer = new ContextRenderer(scene, "app", { showfps: true });
    //const renderer = new Renderer(scene, "app", { showfps: true });
};
