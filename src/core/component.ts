import GameObject from "./gameobject";

export class Component {
    gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    update(): void { }
};