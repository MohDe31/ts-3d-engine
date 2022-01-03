import { Transform } from "../core/transform";
import { Component } from "../core/component";
import { vec2Magnitude, vec2SqrMagnitude, Vec3, vec3Normal, vec3Set, vec3xNumMulR, vec3xVec3AddR, vec3xVec3Sub, vec3xVec3SubR } from "../utils/vecUtils";
import { Mouse } from "../core/mouse";
import { RigidBody2D } from "../core/rigidbody";
import { Time } from "../core/time";
import { MAX_FORCE, MIN_FORCE } from "../constants";
import { Camera } from "../core/camera";
import { CameraMovements } from "./cameraMovements";
import { CameraLook } from "./cameraLook";
import { CueUiManager } from "./cueUiManager";
import Mesh from "../core/mesh";

export class Cue extends Component {

    readonly forceGrowSpeed: number = 100;
    
    balls: Array<RigidBody2D>;

    onFocus: boolean;

    camera: Transform;
    whiteBall: Transform;
    whiteBallRigid: RigidBody2D;
    
    cameraMovements: CameraMovements;
    cameraLook: CameraLook;
    mainCamera: Camera;

    currentForce: number;
    
    lockStatus: boolean;

    meshComponent: Component;

    cueUiManager: CueUiManager;
    

    start(){
        this.cameraMovements = this.mainCamera.getComponent(CameraMovements) as CameraMovements;
        this.cameraLook = this.mainCamera.getComponent(CameraLook) as CameraLook;
        this.onFocus = false;

        this.currentForce = MIN_FORCE;
        this.cueUiManager = this.gameObject.getComponent(CueUiManager) as CueUiManager;

        this.meshComponent = this.gameObject.getComponent(Mesh) as Mesh;
    }

    update(){
        if(!this.camera || ! this.whiteBall)return;

        if(!this.cameraMovements){
            this.start();
        }

        this.transform.lookAtY(this.camera.position);

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
                // const dir: Vec3 = vec3Normal(vec3xVec3SubR(this.camera.position, this.whiteBall.position));

                // vec3Set(this.camera.position, vec3xVec3AddR(vec3xNumMulR(dir, 10), this.whiteBall.position));
                
                // Rotate around the ball
                this.cameraLook.toggleAroundMode(this.whiteBall.position);
                
                // Show the cue
            }else{
                this.onFocus = false;
                this.cameraLook.toggleFreeMode();
                this.cameraMovements.enabled = true;
            }
        }
        
        if(Mouse.lockStatus.Locked && ballsHaveStopped){

            if(!this.meshComponent.enabled){
                this.meshComponent.enabled = true
            }


            vec3Set(this.transform.position, this.whiteBall.position);
            vec3xVec3Sub(this.transform.position, vec3xNumMulR(dir, (this.currentForce - MIN_FORCE) / 10));
    
            if(this.lockStatus && Mouse.GetKey(0)){
                this.currentForce += Time.DeltaTime * this.forceGrowSpeed;
    
                this.cueUiManager.setPower(((this.currentForce - MIN_FORCE) * 100 / (MAX_FORCE - MIN_FORCE)) >> 0);
    
                if(this.currentForce >= MAX_FORCE)
                    this.currentForce = MAX_FORCE;
                
            }
    
            if(Mouse.GetKeyDown(0)){
                this.currentForce = MIN_FORCE;
                this.lockStatus = true;
            }
            
            if(Mouse.GetKeyUp(0)){
                this.cueUiManager.setPower(0);
                this.whiteBallRigid.addForce({x: dir.x * Time.DeltaTime * this.currentForce, y: dir.z * Time.DeltaTime * this.currentForce});
                this.currentForce = MIN_FORCE;
            }
        }else if (this.meshComponent.enabled){
            this.meshComponent.enabled = false;
        }
    }
}