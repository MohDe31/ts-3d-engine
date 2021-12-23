import { Vec3 } from "../utils/vecUtils";
import GameObject from "./gameobject";



export class Light extends GameObject {

    public intensity: number;

    constructor(intensity: number, position: Vec3, rotation: Vec3) {
        super(position, rotation);
        // How much light this light source emits
        this.intensity = Math.min(intensity || 1);
    }

}