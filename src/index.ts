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
import { Vec2, vec3Set } from "./utils/vecUtils";
import { Renderer } from "./core/renderer";
import { SphereVisualization } from "./scripts/sphereVisualization";


function makeBall(sphere: GameObject, ballCollisionHandler: BallCollisionHandler, position: Vec2, onPot: Function) {
    let sphereMesh: Mesh = sphere.addComponent(Mesh) as Mesh;
    sphereMesh.triangles = sphereTriangles(4);

    sphere.addComponent(RigidBody2D);

    const ball: Ball = sphere.addComponent(Ball) as Ball;

    ball.onPot = onPot;
    ballCollisionHandler.balls.push(ball);

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

function initializeBalls(scene: Scene, camera: Camera, floor_x: number, floor_z: number) {
    
    const spheres: Array<GameObject> = new Array<GameObject>(16);
    const gameManager: GameObject = new GameObject();
    scene.addGameObject(gameManager);


    const ballCollisionHandler: BallCollisionHandler = gameManager.addComponent(BallCollisionHandler) as BallCollisionHandler;

    for(let i = 0; i < 5; i+=1)
    for(let j = i; j < 5; j+=1) {
        const sphere: GameObject = new GameObject();
        sphere.transform.position.y = 1;

        makeBall(sphere, 
                 ballCollisionHandler, 
                 {x: (j * 2) - i + ((floor_x >> 1)-4), y: i * 2 + 10},
                 (ball: Ball) => {
                     ball.gameObject.active = false;
                 });

        spheres[i * 5 + (j - i)] = sphere;
        scene.addGameObject(sphere);
    }

    const whiteSphere: GameObject = new GameObject();
    whiteSphere.transform.position.y = 1;
    
    makeBall(whiteSphere,
             ballCollisionHandler,
             {x: floor_x >> 1, y: floor_z - (floor_z >> 2)},
             (ball: Ball) => {
                 ball.transform.position.x = floor_x >> 1;
                 ball.transform.position.z = floor_z - (floor_z >> 2);
                 ball.rigidBody.velocity.x = 0;
                 ball.rigidBody.velocity.y = 0;
             });
    
    scene.addGameObject(whiteSphere);

    const cue: Cue = gameManager.addComponent(Cue) as Cue;
    cue.camera = camera.transform;

    cue.whiteBall = ballCollisionHandler.balls[ballCollisionHandler.balls.length - 1].transform;
    cue.whiteBallRigid = ballCollisionHandler.balls[ballCollisionHandler.balls.length - 1].rigidBody;

    makingHoles(scene, ballCollisionHandler, floor_x, floor_z);
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

function makingHoles(scene: Scene, ballCollisionHandler: BallCollisionHandler, floor_x: number, floor_z: number) {
    const h1: GameObject = new GameObject();
    const h1Mesh: Mesh = h1.addComponent(Mesh) as Mesh;

    h1Mesh.triangles = sphereTriangles(4);
    //h1Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h1.transform.position.x = 1;
    h1.transform.position.z = 1;
    
    h1.transform.scale.x = 1.5;
    h1.transform.scale.z = 1.5;
    h1.transform.scale.y = 0.1;

    scene.addGameObject(h1);

    //------------------------------
    const h2: GameObject = new GameObject();
    const h2Mesh: Mesh = h2.addComponent(Mesh) as Mesh;

    h2Mesh.triangles = sphereTriangles(4);
    //h2Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h2.transform.position.x = floor_x - 1;
    h2.transform.position.z = floor_z - 1;
    
    h2.transform.scale.x = 1.5;
    h2.transform.scale.z = 1.5;
    h2.transform.scale.y = 0.1;

    scene.addGameObject(h2);
    
    //------------------------------
    const h3: GameObject = new GameObject();
    const h3Mesh: Mesh = h3.addComponent(Mesh) as Mesh;

    h3Mesh.triangles = sphereTriangles(4);
    //h3Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h3.transform.position.x = floor_x - 1;
    h3.transform.position.z = 1;
    
    h3.transform.scale.x = 1.5;
    h3.transform.scale.z = 1.5;
    h3.transform.scale.y = 0.1;

    scene.addGameObject(h3);
    
    //------------------------------
    const h4: GameObject = new GameObject();
    const h4Mesh: Mesh = h4.addComponent(Mesh) as Mesh;

    h4Mesh.triangles = sphereTriangles(4);
    //h4Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h4.transform.position.x = 1;
    h4.transform.position.z = floor_z - 1;
    
    h4.transform.scale.x = 1.5;
    h4.transform.scale.z = 1.5;
    h4.transform.scale.y = 0.1;

    scene.addGameObject(h4);

    //------------------------------
    const h5: GameObject = new GameObject();
    const h5Mesh: Mesh = h5.addComponent(Mesh) as Mesh;

    h5Mesh.triangles = sphereTriangles(4);
    //h5Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h5.transform.position.x = floor_x - 1;
    h5.transform.position.z = floor_z >> 1;
    
    h5.transform.scale.x = 1.5;
    h5.transform.scale.z = 1.5;
    h5.transform.scale.y = 0.1;

    scene.addGameObject(h5);
    
    //------------------------------
    const h6: GameObject = new GameObject();
    const h6Mesh: Mesh = h6.addComponent(Mesh) as Mesh;

    h6Mesh.triangles = sphereTriangles(4);
    //h6Mesh.triangles.forEach(tri => tri.material = {r: 0, g: 0, b: 0});
    
    h6.transform.position.x = 1;
    h6.transform.position.z = floor_z >> 1;
    
    h6.transform.scale.x = 1.5;
    h6.transform.scale.z = 1.5;
    h6.transform.scale.y = 0.1;

    scene.addGameObject(h6);


    ballCollisionHandler.holes.push(h1.transform,
                                    h2.transform,
                                    h3.transform,
                                    h4.transform,
                                    h5.transform,
                                    h6.transform);
}

// Read the README.md for instructions to run the program
window.onload = function () {

    // Creating a scene
    const scene : Scene = new Scene();
    const FLOORX: number = 40;
    const FLOORZ: number = FLOORX * 2;

    //#region Floor Creation

    const floor: GameObject = createFloor(FLOORX, FLOORZ);
    scene.addGameObject(floor);
  
    //#endregion

    // Creating a camera for the scene
    scene.camera = new Camera(scene, {x: ((FLOORX / 2) >> 0),y: 7,z: ((FLOORZ / 2) >> 0) - 4.5});//,  {x: Math.PI / 5, y: 0, z: 0});
    scene.camera.addComponent(CameraMovements);
    scene.addGameObject(scene.camera);


    // makeBorders(scene);



    //Making spheres
    initializeBalls(scene, scene.camera, FLOORX, FLOORZ);


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
