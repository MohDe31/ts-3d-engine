import { Component } from "../core/component";
import { Keyboard } from "../core/keyboard";
import { Time } from "../core/time";
import { vec3xNumMulR, vec3xVec3Add } from "../utils/vecUtils";




export class CameraMovements extends Component {

    update() {
        // Calculate the inverse cos, sin of the camera to avoid recalculating them for every triangle
        this.gameObject.transform.calculateInverseCs();
       
        // Get the held keys
        const keysIter = Keyboard.heldKeys.keys();
        
        while(true) {
            const {value, done} = keysIter.next();
            
            if(done) break;
            
            // Some Key functions
            switch(value){
                case 'z': vec3xVec3Add(this.transform.position, vec3xNumMulR(this.transform.forward(), Time.FixedDeltaTime * 10));break;
                case 's': vec3xVec3Add(this.transform.position, vec3xNumMulR(this.transform.forward(), -Time.FixedDeltaTime * 10));break;
                case 'd': vec3xVec3Add(this.transform.position, vec3xNumMulR(this.transform.localRight(), Time.FixedDeltaTime * 10));break;
                case 'q': vec3xVec3Add(this.transform.position, vec3xNumMulR(this.transform.localRight(), -Time.FixedDeltaTime * 10));break;
                
                case ' '      : this.transform.position.y += Time.FixedDeltaTime * 10;break;
                case 'Control': this.transform.position.y -= Time.FixedDeltaTime * 10;break;

                case 'ArrowUp': this.transform.rotation.x -= Time.FixedDeltaTime;break;
                case 'ArrowDown': this.transform.rotation.x += Time.FixedDeltaTime;break;
                case 'ArrowLeft': this.transform.rotation.y -= Time.FixedDeltaTime;break;
                case 'ArrowRight': this.transform.rotation.y += Time.FixedDeltaTime;break;
            }
            
        }
    }
    
}