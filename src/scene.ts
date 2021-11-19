import { config } from "./config";
import { Camera } from "./graphics/camera";
import { Light } from "./graphics/light";
import Mesh from "./graphics/mesh";
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

        this.selectedElementIdx = 0;
    }
    

    drawScene(ctx, dt: number) {
        const keysIter = Keyboard.heldKeys.keys();
        
        this.camera.calculateInverseCs();


        while(true) {
            const {value, done} = keysIter.next();

            if(done) break;
            
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

            // console.log(value);
            
        }

        
        // this.camera.rotateAround({x: (25 / 2) >> 0, y: 1, z: (25 / 2) >> 0}, dt);
        // this.camera.lookAt({x: (25 / 2) >> 0, y: 1, z: (25 / 2) >> 0});

        this.meshes.sort((a, b) => b.getAvgZ() - a.getAvgZ());

        for(let i = 0; i < this.meshes.length; i+=1) {
            this.meshes[i].draw(ctx, this.camera, this.lights);
        }
    }

    keyHandler(e: KeyboardEvent, key) {
        
        if(e.type == "keydown") Keyboard.addKey(key);
        else if(e.type == "keyup") Keyboard.removeKey(key);
    }
}
