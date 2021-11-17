import { Color } from "../utils/color";
import { Vec2, Vec3, vec3xNumDivR, vec3xVec3AddR } from "../utils/vecUtils";




export class Triangle {

    public points: Array<Vec3>;
    public avgZ: number;
    public material: Color;

    constructor(p1: Vec3, p2: Vec3, p3: Vec3);
    constructor(p1: Vec3, p2: Vec3, p3: Vec3, material: Color);
    constructor(p1?: Vec3, p2?: Vec3, p3?: Vec3, material?: Color) {
        this.points = [p1, p2, p3];
        this.avgZ = 0;

        this.material = material || {r: 255, g: 255, b: 255};
        
    }

    getCenter() {
        let v12  = vec3xVec3AddR(this.points[0], this.points[1])
        let v123 = vec3xVec3AddR(v12, this.points[2]);
        return vec3xNumDivR(v123, 3);
    }
}