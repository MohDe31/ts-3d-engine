import { Vec2, Vec3, vec3Cross, vec3Dot, vec3Normal, vec3Set, vec3SqrMagnitude, vec3xVec3Add, vec3xVec3AddR, vec3xVec3Sub, vec3xVec3SubR } from "../utils/vecUtils";
import { rotate } from "./engine";




export default class GameObject {

    public position: Vec3;
    public rotation: Vec3;

    public cos: Vec3;
    public sin: Vec3;

    constructor(position: Vec3, rotation: Vec3)
    {
        this.position = position || {x: 0, y: 0, z: 0};
        this.rotation = rotation || {x: 0, y: 0, z: 0};

        this.cos = { x: 0, y: 0, z: 0 };
        
        this.sin = { x: 0, y: 0, z: 0 };
    }

    rotateAround(point: Vec3, speed: number) {
        let rot_: Vec3 = vec3xVec3SubR(this.position, point);
        let afrot_: Vec3 = rotate(rot_, {x: 0, y: speed, z: 0});
        
        vec3Set(this.position, vec3xVec3AddR(point, afrot_));
    }

    lookAt(point: Vec3) {
        const reqVec = vec3xVec3SubR(point, this.position);

        const rotX: number = Math.atan2(reqVec.y, Math.abs(reqVec.z));
        const rotY: number = Math.atan2(reqVec.x, reqVec.z);
        



        // const rotX = Math.atan2(forward.z - reqVec.z, forward.y - reqVec.y);
        // const rotY = Math.atan2(forward.x - reqVec.x, forward.z - reqVec.z);
        // const rotZ = Math.atan2(forward.x - reqVec.x, forward.y - reqVec.y);


        // console.log(vec3SqrMagnitude(vec3Cross(reqVec, forward)));
        

        /*
        console.log({
            x: rotX,
            y: rotY,
            z: rotZ,
        } as Vec3, vec3SqrMagnitude(vec3Cross(reqVec, forward)));
*/
        vec3Set(this.rotation, {x: -rotX, y: rotY, z: 0});
        // vec3xVec3Add(this.rotation, {x: rotX, y: rotY, z: rotZ});
        
    }

    forward(): Vec3 {
        const xPos: number = Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
        const zPos: number = Math.cos(this.rotation.x) * Math.cos(this.rotation.y);
        const yPos: number = Math.sin(-this.rotation.x);
 
        return { x: xPos, y: yPos, z: zPos }
    }

    localForward(): Vec3 {
        const xPos: number = Math.sin(this.rotation.y);
        const zPos: number = Math.cos(this.rotation.y);
 
        return { x: xPos, y: 0, z: zPos }
    }

    right(): Vec3 {
        const xPos: number = Math.sin(this.rotation.y + Math.PI / 2) * Math.cos(this.rotation.x);
        const zPos: number = Math.cos(this.rotation.x) * Math.cos(this.rotation.y + Math.PI / 2);
        const yPos: number = Math.sin(-this.rotation.x);
 
        return { x: xPos, y: yPos, z: zPos }
    }

    localRight(): Vec3 {
        const xPos: number = Math.sin(this.rotation.y + Math.PI / 2);
        const zPos: number = Math.cos(this.rotation.y + Math.PI / 2);
 
        return { x: xPos, y: 0, z: zPos }
    } 



    calculateInverseCs() {
        this.cos.x = Math.cos(-this.rotation.x);
        this.cos.y = Math.cos(-this.rotation.y);
        this.cos.z = Math.cos(-this.rotation.z);

        this.sin.x = Math.sin(-this.rotation.x);
        this.sin.y = Math.sin(-this.rotation.y);
        this.sin.z = Math.sin(-this.rotation.z);
    }

    calculateCs() {
        this.cos.x = Math.cos(this.rotation.x);
        this.cos.y = Math.cos(this.rotation.y);
        this.cos.z = Math.cos(this.rotation.z);

        this.sin.x = Math.sin(this.rotation.x);
        this.sin.y = Math.sin(this.rotation.y);
        this.sin.z = Math.sin(this.rotation.z);
    }
}