import { cameraProjectionConfig } from "../config";
import Scene from "../scene";
import { Vec3, Vec2, vec3xVec3SubR } from "../utils/vecUtils";
import { rotateCs } from "./engine";
import GameObject from "./gameobject";



export class Camera extends GameObject {

    scene: Scene;
    config: CameraProjectionSettings;

    constructor(scene: Scene);
    constructor(scene: Scene, position: Vec3);
    constructor(scene: Scene, position?: Vec3, rotation?: Vec3) {

        super(position || {x: 0, y: 0, z: 0},
              rotation || {x: 0, y: 0, z: 0});

        this.config = cameraProjectionConfig;
        this.scene = scene;
    }

    getCenterUV(): Vec2 {
        return {
            x: (this.scene.world.WIDTH / 2) >> 0,
            y: (this.scene.world.HEIGHT / 2) >> 0
        };    
    }


    worldToScreenPoint(point: Vec3): Vec2 {
        let camPoints: Vec3 = vec3xVec3SubR(point, this.position);
        camPoints = rotateCs(camPoints, this.cos, this.sin);

        let { x, y } = this.getCenterUV();

        if(camPoints.z <= 0) camPoints.z = .00001;

        let xz = camPoints.x / camPoints.z;
        let yz = camPoints.y / camPoints.z;

        return {
            x: this.config.F * this.config.ALPHA * xz + x,
            y: this.config.F * this.config.BETA * yz + y
        }
    }

}