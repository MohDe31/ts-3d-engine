import { cameraProjectionConfig } from "../config";
import Scene from "./scene";
import { Vec3, Vec2 } from "../utils/vecUtils";
import GameObject from "./gameobject";

export class Camera extends GameObject {

    scene: Scene;
    config: CameraProjectionSettings;

    constructor(scene: Scene);
    constructor(scene: Scene, position: Vec3);
    constructor(scene: Scene, position: Vec3, rotation: Vec3);
    constructor(scene: Scene, position?: Vec3, rotation?: Vec3) {

        super(position, rotation);

        this.config = cameraProjectionConfig;
        this.scene = scene;
    }

    getCenterUV(): Vec2 {
        return {
            x: this.scene.world.WIDTH >> 1,
            y: this.scene.world.HEIGHT >> 1
        };    
    }

}