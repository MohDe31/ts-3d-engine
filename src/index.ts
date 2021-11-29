import Scene from "./core/scene";
import { parseObj } from "./utils/objParser";
import { join } from "path";
import { Light } from "./core/light";
import { Camera } from "./core/camera";
import Mesh from "./core/mesh";
import { Triangle } from "./core/triangle";
import { Ball } from "./scripts/ball";
import GameObject from "./core/gameobject";
import { sphereTriangles } from "./core/primitive";
import { RigidBody2D } from "./core/rigidbody";
import { Renderer } from "./core/renderer";
import { CameraMovements } from "./scripts/cameraMovements";
import { BallCollisionHandler } from "./scripts/collisions";
import { vec3Set } from "./utils/vecUtils";
import { Cue } from "./scripts/cue";

function initializeBalls(scene: Scene, camera: Camera) {
    
    const spheres: Array<GameObject> = new Array<GameObject>(2);
    const gameManager: GameObject = new GameObject();
    scene.addGameObject(gameManager);


    const ballCollisionHandler: BallCollisionHandler = gameManager.addComponent(BallCollisionHandler) as BallCollisionHandler;

    for(let i = 0; i < spheres.length; i+=1){

        spheres[i] = new GameObject();

        let sphereMesh: Mesh = spheres[i].addComponent(Mesh) as Mesh;
        sphereMesh.triangles = sphereTriangles(4);

        spheres[i].addComponent(RigidBody2D);
        ballCollisionHandler.balls.push(spheres[i].addComponent(Ball) as Ball);

        scene.addGameObject(spheres[i]);
    }
    

    const cue: Cue = gameManager.addComponent(Cue) as Cue;
    cue.camera = camera.transform;
    cue.whiteBall = ballCollisionHandler.balls[0].transform;
    cue.whiteBallRigid = ballCollisionHandler.balls[0].rigidBody;

    (spheres[0].getComponent(Mesh) as Mesh).triangles.forEach(tri => tri.material.r = 0);


    (spheres[0].getComponent(RigidBody2D) as RigidBody2D).addForce({x: 1, y: 0});
}


function createFloor(floor_x: number, floor_z: number): GameObject {
    const floor : GameObject = new GameObject();
    const floorMesh: Mesh = floor.addComponent(Mesh) as Mesh;

    for(let i = 0; i < floor_x; i+=1)
    for(let j = 0; j < floor_z; j+=1) {
        let c_ = (i+j)%2 == 1 ? 255 : 0;
        floorMesh.triangles.push(
            new Triangle({x: i + 1, y: 0, z: j + 1}, {x: i + 1, y: 0, z: j}, {x: i, y: 0, z: j}, {r: c_, g: c_, b: c_}),
            new Triangle({x: i, y: 0, z: j + 1}, {x: i + 1, y: 0, z: j + 1}, {x: i, y: 0, z: j}, {r: c_, g: c_, b: c_}),
        )
    }

    return floor;
}

// Read the README.md for instructions to run the program
window.onload = function () {

    // Creating a scene
    const scene : Scene = new Scene();

    //#region Floor Creation
    const FLOORX: number = 25;
    const FLOORZ: number = 25;

    const floor: GameObject = createFloor(FLOORX, FLOORZ);
    scene.addGameObject(floor);
    //#endregion
    
    //#region Table loading
    const table : GameObject = parseObj(join(__dirname, "/assets/bill-table.obj"));

    // Initializing the table position
    table.transform.position  = { x: (FLOORX / 2) >> 0,
                        y: 1,
                        z: (FLOORZ / 2) >> 0};

    scene.addGameObject(table );
    //#endregion


    // Creating a camera for the scene
    scene.camera = new Camera(scene, {x: ((FLOORX / 2) >> 0),y: 7,z: ((FLOORZ / 2) >> 0) - 4.5},  {x: Math.PI / 5, y: 0, z: 0});
    scene.camera.addComponent(CameraMovements);
    scene.addGameObject(scene.camera);




    //Making spheres
    initializeBalls(scene, scene.camera);


    // Creating a light for the scene
    scene.lights.push(new Light(1, {x: 0,y: 1, z: 0}, {x: Math.PI / 5, y: 0, z: 0}));//{x: Math.PI / 2, y: 0, z: 0}));


    // Initialize a renderer
    Renderer.init(scene, "app", { showfps: true });
};
