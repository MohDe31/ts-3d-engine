import { Component } from "../core/component";
import { Mouse } from "../core/mouse";
import { Time } from "../core/time";
import { Vec3 } from "../utils/vecUtils";


export class CameraLook extends Component {

    private sensitivity: number = .06;

    private freeLook: boolean = true;
    private target: Vec3;

    toggleAroundMode(target: Vec3) {
        this.target = target;
        this.freeLook = false;
    }

    toggleFreeMode() {
        this.freeLook = true;
    }

    update() {
        const {x, y} = Mouse.GetMouseMovements();
        if(this.freeLook){
            this.transform.rotation.x += y * this.sensitivity * Time.FixedDeltaTime;
            this.transform.rotation.y += x * this.sensitivity * Time.FixedDeltaTime;
            
            this.transform.rotation.x = Math.max(
                this.transform.rotation.x,
                -Math.PI >> 1
            );

            this.transform.rotation.x = Math.min(
                this.transform.rotation.x,
                Math.PI >> 1
            );
        }else{
            this.transform.rotateAroundMan(this.target,  this.sensitivity * Time.FixedDeltaTime * x,  - this.sensitivity * Time.FixedDeltaTime * y);
            this.transform.lookAt(this.target);
        }
    }
    
}