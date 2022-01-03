import { Transform } from "../core/transform";
import { Component } from "../core/component";
import { vec2Magnitude, vec2SqrMagnitude, Vec3, vec3Normal, vec3Set, vec3xNumMulR, vec3xVec3AddR, vec3xVec3SubR } from "../utils/vecUtils";
import { Mouse } from "../core/mouse";
import { RigidBody2D } from "../core/rigidbody";
import { Time } from "../core/time";
import { MAX_FORCE } from "../constants";
import { Camera } from "../core/camera";
import { CameraMovements } from "./cameraMovements";
import GameObject from "../core/gameobject";
import { CameraLook } from "./cameraLook";

export class Cue extends Component {
    
    balls: Array<RigidBody2D>;

    onFocus: boolean;

    camera: Transform;
    whiteBall: Transform;
    whiteBallRigid: RigidBody2D;
    
    cameraMovements: CameraMovements;
    cameraLook: CameraLook;
    mainCamera: Camera;


    start(){
        this.cameraMovements = this.mainCamera.getComponent(CameraMovements) as CameraMovements;
        this.cameraLook = this.mainCamera.getComponent(CameraLook) as CameraLook;
        this.onFocus = false;
    }

    update(){
        if(!this.camera || ! this.whiteBall)return;

        if(!this.cameraMovements){
            this.start();
        }

        const dir: Vec3 = vec3Normal(vec3xVec3SubR(this.whiteBall.position, this.camera.position));

        const ballsHaveStopped: boolean = vec2SqrMagnitude(this.whiteBallRigid.velocity) + this.balls.map(rigid => vec2SqrMagnitude(rigid.velocity) * Number(rigid.gameObject.active)).reduce((a, b) => a + b) == 0;    

        if(Mouse.GetKeyDown(2) && Mouse.lockStatus.Locked){
            // Remove control from player
            if(!this.onFocus){
                this.onFocus = true;
                this.cameraMovements.enabled = false;
                // Look at the ball
                this.camera.lookAt(this.whiteBall.position);
                // Zoom in
                const dir: Vec3 = vec3Normal(vec3xVec3SubR(this.camera.position, this.whiteBall.position));

                vec3Set(this.camera.position, vec3xVec3AddR(vec3xNumMulR(dir, 10), this.whiteBall.position));
                
                // Rotate around the ball
                this.cameraLook.toggleAroundMode(this.whiteBall.position);
                
                // Show the cue
            }else{
                this.onFocus = false;
                this.cameraLook.toggleFreeMode();
                this.cameraMovements.enabled = true;
            }
        }

        if(Mouse.GetKeyDown(0) && Mouse.lockStatus.Locked && ballsHaveStopped){
            this.whiteBallRigid.addForce({x: dir.x * Time.FixedDeltaTime * MAX_FORCE, y: dir.z * Time.FixedDeltaTime * MAX_FORCE});

        }
        /*if(){
            if(Mouse.GetKeyDown(0) && Mouse.lockStatus.Locked){
                this.whiteBallRigid.addForce({x: dir.x * Time.FixedDeltaTime * MAX_FORCE, y: dir.z * Time.FixedDeltaTime * MAX_FORCE});
            }else if(Mouse.GetKeyDown(2) && Mouse.lockStatus.Locked){
                this.whiteBallRigid.addForce({x: -dir.x * Time.FixedDeltaTime * MAX_FORCE, y: -dir.z * Time.FixedDeltaTime * MAX_FORCE});
            }
        }*/
    }
}