import { config } from "./config";
import { Camera } from "./core/camera";
import GameObject from "./core/gameobject";
import { Light } from "./core/light";
import Mesh from "./core/mesh";
import { Keyboard } from "./utils/keyboard";
import { vec3xNumMulR, vec3xVec3Add } from "./utils/vecUtils";

export default class Scene {
    private gameObjects: Array<GameObject>;



    selectedElementIdx: number;

    world: WorldSettings;

    camera: Camera;

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

    update(dt: number) {
        // Get the held keys
        const keysIter = Keyboard.heldKeys.keys();
        
        // Calculate the inverse cos, sin of the camera to avoid recalculating them for every triangle
        this.camera.calculateInverseCs();


        // Loop on every key held
        while(true) {
            const {value, done} = keysIter.next();

            if(done) break;
            
            // Some Key functions
            switch(value){
                case 'z': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.forward(), dt * 10));break;
                case 's': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.forward(), -dt * 10));break;
                case 'd': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.localRight(), dt * 10));break;
                case 'q': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.localRight(), -dt * 10));break;
                
                case ' '      : this.camera.position.y += dt * 10;break;
                case 'Control': this.camera.position.y -= dt * 10;break;

                case 'ArrowUp': this.camera.rotation.x -= dt;break;
                case 'ArrowDown': this.camera.rotation.x += dt;break;
                case 'ArrowLeft': this.camera.rotation.y -= dt;break;
                case 'ArrowRight': this.camera.rotation.y += dt;break;
            }
            
        }

        this.gameObjects.forEach(gameObject => {
            gameObject.update(dt);
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

    keyHandler(e: KeyboardEvent, key) {
        // Registering key strokes 
        if(e.type == "keydown") Keyboard.addKey(key);
        else if(e.type == "keyup") Keyboard.removeKey(key);
    }
}
