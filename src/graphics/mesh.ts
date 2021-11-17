import { Color, HSVColor, hsvToRgb, rgbToHsv, rgbToString } from "../utils/color";
import { Vec2, Vec3, vec3Cross, vec3Dot, vec3Normal, vec3xNumDivR, vec3xVec3AddR, vec3xVec3SubR } from "../utils/vecUtils";
import { Camera } from "./camera";
import { rotateCs } from "./engine";
import GameObject from "./gameobject";
import { Light } from "./light";
import { Triangle } from "./triangle";




export default class Mesh extends GameObject {

    public triangles: Array<Triangle>;

    constructor(position: Vec3, rotation: Vec3) {
        super(position, rotation);

        this.triangles = new Array<Triangle>();
    }

    getAvgZ(): number {
        return this.triangles.map(tri => tri.avgZ).reduce((a, b) => a + b) / this.triangles.length;
    }

    getLightIntensity(surfaceNormal: Vec3, lightNormal: Vec3): number {
        let dotProduct = vec3Dot(surfaceNormal, lightNormal);

        return dotProduct >= 0 ? 0 : -dotProduct;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera, lights: Array<Light>) {
        this.calculateCs();

        let triangle: Triangle;
        let uv1: Vec2, uv2: Vec2, uv3: Vec2;
        let rotated_p1: Vec3, rotated_p2: Vec3, rotated_p3: Vec3;
        let translated_1: Vec3, translated_2: Vec3, translated_3: Vec3;
        let center: Vec3;
        let cameraDiff: Vec3;
        let v21: Vec3, v31: Vec3;
        let norm: Vec3;
        let dProduct: number;
        let dDirection: number;

        let material: Color;
        let hsvMaterial: HSVColor;

        let lightIntensity: number;

        ctx.strokeStyle = "WHITE";
        
        const cameraForward = camera.forward();
        const lightNormalArr = lights.map(light => light.forward());

        for(let i = 0; i < this.triangles.length; i+=1) {
            triangle = this.triangles[i];

            rotated_p1 = rotateCs(triangle.points[0], this.cos, this.sin);
            rotated_p2 = rotateCs(triangle.points[1], this.cos, this.sin);
            rotated_p3 = rotateCs(triangle.points[2], this.cos, this.sin);

            translated_1 = vec3xVec3AddR(rotated_p1, this.position);
            translated_2 = vec3xVec3AddR(rotated_p2, this.position);
            translated_3 = vec3xVec3AddR(rotated_p3, this.position);


            // triangle.avgZ = (translated_1[2] + translated_2[2] + translated_3[2]) / 3.0
            
            center  = vec3xNumDivR(vec3xVec3AddR(vec3xVec3AddR(translated_1, translated_2), translated_3), 3);
            
            cameraDiff = vec3xVec3SubR(center, camera.position);


            v21 = vec3xVec3SubR(translated_2, translated_1);
            v31 = vec3xVec3SubR(translated_3, translated_1);

            norm = vec3Cross(v21, v31);

            dProduct = vec3Dot(norm, cameraDiff);
            dDirection = vec3Dot(cameraDiff, cameraForward);

            if (dProduct < 0) {

                uv1 = camera.worldToScreenPoint(translated_1);
                uv2 = camera.worldToScreenPoint(translated_2);
                uv3 = camera.worldToScreenPoint(translated_3);

                lightIntensity = 0;

                material = triangle.material;

                hsvMaterial = rgbToHsv(material);
    
                for(let j = 0; j < lights.length; ++j)
                {
                    lightIntensity += this.getLightIntensity(vec3Normal(norm), lightNormalArr[j]);
                }

                hsvMaterial.v = lightIntensity;

                material = hsvToRgb(hsvMaterial);

                ctx.fillStyle = rgbToString(material);

                ctx.beginPath();
                ctx.moveTo(uv1.x, uv1.y);
                ctx.lineTo(uv2.x, uv2.y);
                ctx.lineTo(uv3.x, uv3.y);
                ctx.lineTo(uv1.x, uv1.y);
                ctx.fill();
            }
            

        }
    }
}
