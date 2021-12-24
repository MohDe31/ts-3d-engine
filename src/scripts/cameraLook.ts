import { Component } from "../core/component";
import { Mouse } from "../core/mouse";
import { Time } from "../core/time";

export class CameraLook extends Component {

    private sensitivity: number = .06;

    update() {
        const {x, y} = Mouse.GetMouseMovements();
        
        this.transform.rotation.x += y * this.sensitivity * Time.DeltaTime;
        this.transform.rotation.y += x * this.sensitivity * Time.FixedDeltaTime;
        
        this.transform.rotation.x = Math.max(
            this.transform.rotation.x,
            -Math.PI >> 1
        );

        this.transform.rotation.x = Math.min(
            this.transform.rotation.x,
            Math.PI >> 1
        );
    }
    
}