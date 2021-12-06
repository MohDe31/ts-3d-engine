import { Transform } from "../core/transform";
import { Component } from "../core/component";
import { Vec3, vec3Normal, vec3xVec3SubR } from "../utils/vecUtils";
import { Mouse } from "../core/mouse";
import { RigidBody2D } from "../core/rigidbody";

export class Cue extends Component {
    
    camera: Transform;
    whiteBall: Transform;
    whiteBallRigid: RigidBody2D;
    

    update(){
        if(!this.camera || ! this.whiteBall)return;

        const dir: Vec3 = vec3Normal(vec3xVec3SubR(this.whiteBall.position, this.camera.position));

        if(Mouse.GetKeyDown(0)){
            this.whiteBallRigid.addForce({x: dir.x, y: dir.z});
        }else if(Mouse.GetKeyDown(2)){
            this.whiteBallRigid.addForce({x: -dir.x, y: -dir.z});
        }

    }
}