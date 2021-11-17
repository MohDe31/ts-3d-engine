import { config } from "./config";
import { Camera } from "./graphics/camera";
import { Light } from "./graphics/light";
import Mesh from "./graphics/mesh";
import Renderer from "./renderer";
import { Keyboard } from "./utils/keyboard";
import { vec3xNumMulR, vec3xVec3Add } from "./utils/vecUtils";

export default class Scene {
    selectedElementIdx: number;

    world: WorldSettings;

    camera: Camera;

    lights: Array<Light>;
    meshes: Array<Mesh>;

    constructor();
    constructor(world_s: WorldSettings);
    constructor(world_s?: WorldSettings) {
        this.world = world_s || config;

        this.meshes = new Array<Mesh>();
        this.lights = new Array<Light>();

        // this.elementIndexes = new Int32Array(((this.world.WIDTH * this.world.HEIGHT) / this.world.ELEMENT_SIZE) >> 0);
        // this.elementIndexes.fill(-1);

        this.selectedElementIdx = 0;
    }
    

    drawScene(ctx, dt: number) {
        const keysIter = Keyboard.heldKeys.keys();
        
        while(true) {
            const {value, done} = keysIter.next();

            if(done) break;

            switch(value){
                case 'z': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.forward(), dt * 10));break;
                case 's': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.forward(), -dt * 10));break;
                case 'd': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.right(), dt * 10));break;
                case 'q': vec3xVec3Add(this.camera.position, vec3xNumMulR(this.camera.right(), -dt * 10));break;
                
                case ' '      : this.camera.position.y += dt * 10;break;
                case 'Control': this.camera.position.y -= dt * 10;break;

                case 'ArrowUp': this.camera.rotation.x -= dt;break;
                case 'ArrowDown': this.camera.rotation.x += dt;break;
                case 'ArrowLeft': this.camera.rotation.y -= dt;break;
                case 'ArrowRight': this.camera.rotation.y += dt;break;
            }

            // console.log(value);
            
        }


        this.camera.calculateInverseCs();
        for(let i = 0; i < this.meshes.length; i+=1) {
            this.meshes[i].draw(ctx, this.camera, this.lights);
        }
    }

    onMouseDrag(...args) {
        const e: MouseEvent = args[0];

        const rect = Renderer.instance.getBoundRect();

        const x = (e.clientX - rect.x) >> 0;
        const y = (e.clientY - rect.y) >> 0;

        let position = {x: x, y: y};
        //position.__fix(this.world.ELEMENT_SIZE);
    }

    keyHandler(e: KeyboardEvent, key) {
        
        if(e.type == "keydown") Keyboard.addKey(key);
        else if(e.type == "keyup") Keyboard.removeKey(key);
        
        // TODO: Handle keys
    }

    pointToIdx(x: number, y: number) {
        return (((y / this.world.ELEMENT_SIZE) * this.world.WIDTH + x) / this.world.ELEMENT_SIZE) >> 0;
    }
}
