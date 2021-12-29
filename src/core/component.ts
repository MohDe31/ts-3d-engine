import { Transform } from "./transform";
import GameObject from "./gameobject";

export class Component {
    gameObject: GameObject;
    transform: Transform;
    enabled: boolean = true;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.transform  = this.gameObject.transform;
    }

    update(): void { }
};