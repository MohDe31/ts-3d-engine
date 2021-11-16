import { Vec2, Vec3 } from "../utils/vecUtils";
import { rotate } from "./engine";




export default class GameObject {

    public position: Vec3;
    public rotation: Vec3;

    public cos: Vec3;
    public sin: Vec3;

    constructor(position: Vec3, rotation: Vec3)
    {
        this.position = position;
        this.rotation = rotation;

        this.cos = {
            x: 0,
            y: 0,
            z: 0
        };;
        
        this.sin = {
            x: 0,
            y: 0,
            z: 0
        };
    }


    forward(): Vec3 {
        return rotate({x: 0, y: 0, z: 1}, this.rotation);
    }

    right(): Vec3 {
        return rotate({x: 1, y: 0, z: 0}, this.rotation);
    }

    calculateInverseCs() {
        this.cos.x = Math.cos(-this.rotation.x);
        this.cos.y = Math.cos(-this.rotation.y);
        this.cos.z = Math.cos(-this.rotation.z);

        this.sin.x = Math.sin(-this.rotation.x);
        this.sin.y = Math.sin(-this.rotation.y);
        this.sin.z = Math.sin(-this.rotation.z);
    }

    calculateCs() {
        this.cos.x = Math.cos(this.rotation.x);
        this.cos.y = Math.cos(this.rotation.y);
        this.cos.z = Math.cos(this.rotation.z);

        this.sin.x = Math.sin(this.rotation.x);
        this.sin.y = Math.sin(this.rotation.y);
        this.sin.z = Math.sin(this.rotation.z);
    }
}