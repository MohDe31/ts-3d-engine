import { Transform } from "./transform";
import GameObject from "./gameobject";

export class Component {
    gameObject: GameObject;
    transform: Transform;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.transform  = this.gameObject.transform;
    }

    update(): void { }
};