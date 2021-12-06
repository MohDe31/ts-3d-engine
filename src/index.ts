import Scene from "./core/scene";
import { Light } from "./core/light";
import { Camera } from "./core/camera";
import Mesh from "./core/mesh";
import { Triangle } from "./core/triangle";
import { Ball } from "./scripts/ball";
import GameObject from "./core/gameobject";
import { cubeTriangles, sphereTriangles } from "./core/primitive";
import { RigidBody2D } from "./core/rigidbody";
import { CameraMovements } from "./scripts/cameraMovements";
import { BallCollisionHandler } from "./scripts/collisions";
import { Cue } from "./scripts/cue";
import { Vec2 } from "./utils/vecUtils";
import { Renderer } from "./core/renderer";
import { SphereVisualization } from "./scripts/sphereVisualization";


function makeBall(sphere: GameObject, ballCollisionHandler: BallCollisionHandler, position: Vec2) {
    let sphereMesh: Mesh = sphere.addComponent(Mesh) as Mesh;
    sphereMesh.triangles = sphereTriangles(4);

    sphere.addComponent(RigidBody2D);

    ballCollisionHandler.balls.push(sphere.addComponent(Ball) as Ball);

    sphere.transform.position.x = position.x;
    sphere.transform.position.z = position.y;
}


function makeBorders(scene: Scene) {
    const leftBorder: GameObject = new GameObject();
    const mesh: Mesh = leftBorder.addComponent(Mesh) as Mesh;

    mesh.triangles = cubeTriangles(1);
    mesh.triangles.forEach(tri => tri.material = { r: 255, g: 0, b: 0 });


    leftBorder.transform.position.y = 4;
    leftBorder.transform.scale.z = 80;

    scene.addGameObject(leftBorder);

}

function initializeBalls(scene: Scene, camera: Camera) {
    
    const spheres: Array<GameObject> = new Array<GameObject>(16);
    const gameManager: GameObject = new GameObject();
    scene.addGameObject(gameManager);


    const ballCollisionHandler: BallCollisionHandler = gameManager.addComponent(BallCollisionHandler) as BallCollisionHandler;

    for(let i = 0; i < 5; i+=1)
    for(let j = i; j < 5; j+=1) {
        const sphere: GameObject = new GameObject();
        sphere.transform.position.y = 3;

        makeBall(sphere, ballCollisionHandler, {x: (j * 2) - i, y: i * 2});

        spheres[i * 5 + (j - i)] = sphere;
        scene.addGameObject(sphere);
    }

    const whiteSphere: GameObject = new GameObject();
    whiteSphere.transform.position.y = 3;
    
    makeBall(whiteSphere, ballCollisionHandler, {x: 5, y: 50});
    
    scene.addGameObject(whiteSphere);

    const cue: Cue = gameManager.addComponent(Cue) as Cue;
    cue.camera = camera.transform;

    cue.whiteBall = ballCollisionHandler.balls[ballCollisionHandler.balls.length - 1].transform;
    cue.whiteBallRigid = ballCollisionHandler.balls[ballCollisionHandler.balls.length - 1].rigidBody;
}


function createFloor(floor_x: number, floor_z: number): GameObject {
    const floor : GameObject = new GameObject();
    const floorMesh: Mesh = floor.addComponent(Mesh) as Mesh;

    floorMesh.triangles.push(
        new Triangle({x: floor_x, y: 0, z: floor_z}, {x: floor_x, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {r: 0, g: 255, b: 0}),
        new Triangle({x: 0, y: 0, z: floor_z}, {x: floor_x, y: 0, z: floor_z}, {x: 0, y: 0, z: 0}, {r: 0, g: 255, b: 0}),
    )
    
    return floor;
}

// Read the README.md for instructions to run the program
window.onload = function () {

    // Creating a scene
    const scene : Scene = new Scene();
    const FLOORX: number = 40;
    const FLOORZ: number = FLOORX * 2;

    //#region Floor Creation

    const floor: GameObject = createFloor(FLOORX, FLOORZ);
    floor.transform.position = {
        x: -(FLOORX / 2) + 5,
        y: 0,
        z: -(FLOORZ / 4)
    }
    scene.addGameObject(floor);
  
    //#endregion

    // Creating a camera for the scene
    scene.camera = new Camera(scene, {x: ((FLOORX / 2) >> 0),y: 7,z: ((FLOORZ / 2) >> 0) - 4.5});//,  {x: Math.PI / 5, y: 0, z: 0});
    scene.camera.addComponent(CameraMovements);
    scene.addGameObject(scene.camera);


    makeBorders(scene);


    //Making spheres
    initializeBalls(scene, scene.camera);


    // Creating a light for the scene
    scene.lights.push(new Light(1, {x: 0,y: 1, z: 0}, {x: Math.PI / 5, y: 0, z: 0}));//{x: Math.PI / 2, y: 0, z: 0}));



    const cube: GameObject = new GameObject();
    let mesh: Mesh = (cube.addComponent(Mesh) as Mesh);
    mesh.triangles = cubeTriangles(8);
    mesh.triangles.forEach(tri => tri.material = {r: (Math.random() * 255) >> 0, g: (Math.random() * 255) >> 0, b:(Math.random() * 255) >> 0 });

    cube.transform.scale.x = 5;
    cube.transform.scale.y = 5;
    cube.transform.scale.z = 5;

    cube.transform.position = {x: ((FLOORX / 2) >> 0),y: 7,z: ((FLOORZ / 2) >> 0) + 3};
    cube.addComponent(SphereVisualization);

    scene.addGameObject(cube);


    // Initialize a renderer
    Renderer.init(scene, "app", { showfps: true });
};
