import { Component } from "../core/component";
import GameObject from "../core/gameobject";
import { Keyboard } from "../core/keyboard";
import { Time } from "../core/time";
import { vec3xNumMulR, vec3xVec3Add } from "../utils/vecUtils";




export class CameraMovements extends Component {

    constructor(gameObject: GameObject){
        super(gameObject);
    }

    update() {
        // Calculate the inverse cos, sin of the camera to avoid recalculating them for every triangle
        this.gameObject.calculateInverseCs();


        // Get the held keys
        const keysIter = Keyboard.heldKeys.keys();
        
        while(true) {
            const {value, done} = keysIter.next();

            if(done) break;
            
            // Some Key functions
            switch(value){
                case 'z': vec3xVec3Add(this.gameObject.position, vec3xNumMulR(this.gameObject.forward(), Time.FixedDeltaTime * 10));break;
                case 's': vec3xVec3Add(this.gameObject.position, vec3xNumMulR(this.gameObject.forward(), -Time.FixedDeltaTime * 10));break;
                case 'd': vec3xVec3Add(this.gameObject.position, vec3xNumMulR(this.gameObject.localRight(), Time.FixedDeltaTime * 10));break;
                case 'q': vec3xVec3Add(this.gameObject.position, vec3xNumMulR(this.gameObject.localRight(), -Time.FixedDeltaTime * 10));break;
                
                case ' '      : this.gameObject.position.y += Time.FixedDeltaTime * 10;break;
                case 'Control': this.gameObject.position.y -= Time.FixedDeltaTime * 10;break;

                case 'ArrowUp': this.gameObject.rotation.x -= Time.FixedDeltaTime;break;
                case 'ArrowDown': this.gameObject.rotation.x += Time.FixedDeltaTime;break;
                case 'ArrowLeft': this.gameObject.rotation.y -= Time.FixedDeltaTime;break;
                case 'ArrowRight': this.gameObject.rotation.y += Time.FixedDeltaTime;break;
            }
            
        }
    }
    
}