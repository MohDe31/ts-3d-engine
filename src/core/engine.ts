import { Vec3 } from "../utils/vecUtils";


export function rotate(point: Vec3, rotation: Vec3): Vec3 {
    let cos: Vec3 = {
        x: Math.cos(rotation.x),
        y: Math.cos(rotation.y),
        z: Math.cos(rotation.z),
    }

    let sin: Vec3 = {
        x: Math.sin(rotation.x),
        y: Math.sin(rotation.y),
        z: Math.sin(rotation.z),
    }

    return rotateCs(point, cos, sin);
}


// Based on https://en.wikipedia.org/wiki/Rotation_matrix#General_rotations
export function rotateCs(point: Vec3, cos: Vec3, sin: Vec3): Vec3 {
    return {
        x: point.x * (cos.z*cos.y-sin.x*sin.y*sin.z) - point.y * sin.z * cos.x + point.z * (cos.z*sin.y+sin.x*sin.z*cos.y),
        y: point.x * (sin.z*cos.y+cos.z*sin.x*sin.y) + point.y * cos.z * cos.x + point.z * (sin.z*sin.y-cos.z*sin.x*cos.y),
        z: point.x * cos.x * -sin.y + point.y * sin.x + point.z * cos.x * cos.y
    };
}