import { Transform } from "../core/transform";
import { Component } from "../core/component";
import { vec2Magnitude, vec2SqrMagnitude, Vec3, vec3Normal, vec3xVec3SubR } from "../utils/vecUtils";
import { Mouse } from "../core/mouse";
import { RigidBody2D } from "../core/rigidbody";
import { Time } from "../core/time";
import { MAX_FORCE } from "../constants";

export class Cue extends Component {
    
    camera: Transform;
    whiteBall: Transform;
    whiteBallRigid: RigidBody2D;
    

    update(){
        if(!this.camera || ! this.whiteBall)return;

        const dir: Vec3 = vec3Normal(vec3xVec3SubR(this.whiteBall.position, this.camera.position));
        console.log(vec2SqrMagnitude(this.whiteBallRigid.velocity));
        
        if(vec2SqrMagnitude(this.whiteBallRigid.velocity) == 0){
            if(Mouse.GetKeyDown(0)){
                this.whiteBallRigid.addForce({x: dir.x * Time.FixedDeltaTime * MAX_FORCE, y: dir.z * Time.FixedDeltaTime * MAX_FORCE});
            }else if(Mouse.GetKeyDown(2)){
                this.whiteBallRigid.addForce({x: -dir.x * Time.FixedDeltaTime * MAX_FORCE, y: -dir.z * Time.FixedDeltaTime * MAX_FORCE});
            }
        }
    }
}