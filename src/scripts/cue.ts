import { Mouse } from "../core/mouse";
import { Vec3, vec3Normal, vec3xVec3SubR } from "../utils/vecUtils";

function cueScript(ballPosition: Vec3, cameraPosition: Vec3){
    if(Mouse.GetKeyDown(0)) {
        const dir: Vec3 = vec3Normal(vec3xVec3SubR(ballPosition, cameraPosition));


        

        
    }
}