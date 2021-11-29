import { config } from "../config";
import { Camera } from "./camera";
import GameObject from "./gameobject";
import { Light } from "./light";
import Mesh from "./mesh";
import { Keyboard } from "./keyboard";
import { vec3xNumMulR, vec3xVec3Add } from "../utils/vecUtils";

export default class Scene {
    private gameObjects: Array<GameObject>;

    selectedElementIdx: number;

    world: WorldSettings;

    private _camera: Camera;

    set camera(cam: Camera) {
        this._camera = cam;
        this.addGameObject(cam);
    }

    get camera(): Camera {
        return this._camera;
    }


    lights: Array<Light>;
    meshes: Array<Mesh>;

    constructor();
    constructor(world_s: WorldSettings);
    constructor(world_s?: WorldSettings) {
        this.world = world_s || config;

        this.gameObjects = new Array<GameObject>();

        this.meshes = new Array<Mesh>();
        this.lights = new Array<Light>();

        this.selectedElementIdx = 0;
    }

    addGameObject(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
        
        const mesh: Mesh = gameObject.getComponent(Mesh) as Mesh;

        if(mesh)
            this.meshes.push(mesh);
    }

    update() {

        this.gameObjects.forEach(gameObject => {
            gameObject.update();
        });
        
        // Rotate around the table position
        // this.camera.rotateAround({x: (25 / 2) >> 0, y: 1, z: (25 / 2) >> 0}, dt);
        // Look at the table
        // this.camera.lookAt({x: (25 / 2) >> 0, y: 1, z: (25 / 2) >> 0});

        // Sorting meshes based on the average Z.
        this.meshes.sort((a, b) => b.getAvgZ() - a.getAvgZ());

    }
    
    //TODO: this should be undefined
    drawScene(ctx: CanvasRenderingContext2D) {
        // Draw all the meshes
        for(let i = 0; i < this.meshes.length; i+=1) {
            this.meshes[i].draw(ctx, this.camera, this.lights);
        }
    }
}
