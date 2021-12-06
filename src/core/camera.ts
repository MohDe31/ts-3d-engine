import { cameraProjectionConfig } from "../config";
import Scene from "./scene";
import { Vec3, Vec2, vec3xVec3SubR } from "../utils/vecUtils";
import { rotateCs } from "./engine";
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
            x: (this.scene.world.WIDTH >> 1),
            y: (this.scene.world.HEIGHT >> 1)
        };    
    }


    worldToScreenPoint(point: Vec3): Vec2 {
        let camPoints: Vec3 = vec3xVec3SubR(point, this.transform.position);
        camPoints = rotateCs(camPoints, this.transform.cos, this.transform.sin);

        let { x, y } = this.getCenterUV();

        if(camPoints.z == 0) camPoints.z = 0.00001;//return undefined;
        else if(camPoints.z < 0 ) return undefined;

        let xz = camPoints.x / camPoints.z;
        let yz = camPoints.y / camPoints.z;

        return {
            x: this.config.ALPHA * xz,
            y: this.config.BETA * yz
        }
    }

}