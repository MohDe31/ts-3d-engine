export type Vec2 = {
    x: number,
    y: number
}

export type Vec3 = {
    x: number,
    y: number,
    z: number
}

export function vec3xVec3Sub(v1: Vec3, v2: Vec3) {
    v1.x -= v2.x;
    v1.y -= v2.y;
    v1.z -= v2.z;
}

export function vec3xVec3Add(v1: Vec3, v2: Vec3) {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
}

export function vec3xVec3AddR(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    }
}

export function vec3xVec3SubR(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
    }
}

export function vec3xNumDivR(v1: Vec3, num: number): Vec3 {
    return {
        x: v1.x / num,
        y: v1.y / num,
        z: v1.z / num,
    }
}

export function vec3xNumMulR(v1: Vec3, num: number): Vec3 {
    return {
        x: v1.x * num,
        y: v1.y * num,
        z: v1.z * num,
    }
}

export function vec3SqrMagnitude(vec: Vec3): number {
    return (vec.x * vec.x + vec.y * vec.y + vec.z * vec.z)
}

export function vec3Magnitude(vec: Vec3): number {
    return Math.sqrt(vec3SqrMagnitude(vec));
}

export function vec3Normal(vec: Vec3): Vec3 {
    let magnitude = vec3Magnitude(vec);
    return vec3xNumDivR(vec, magnitude);
}

export function vec3Normalize(vec: Vec3) {
    let magnitude = vec3Magnitude(vec);
    vec.x /= magnitude;
    vec.y /= magnitude;
    vec.z /= magnitude;
}

export function vec3Dot(v1: Vec3, v2: Vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function vec3Cross(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.y * v2.z - v2.y * v1.z,
        y: v2.x * v1.z - v1.x * v2.z,
        z: v1.x * v2.y - v2.x * v1.y
    }
}