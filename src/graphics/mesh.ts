import { Color, HSVColor, hsvToRgb, rgbToHsv, rgbToString } from "../utils/color";
import { Vec2, Vec3, vec3Cross, vec3Dot, vec3Normal, vec3SqrMagnitude, vec3xNumDivR, vec3xVec3AddR, vec3xVec3SubR } from "../utils/vecUtils";
import { Camera } from "./camera";
import { rotateCs } from "./engine";
import GameObject from "./gameobject";
import { Light } from "./light";
import { Triangle } from "./triangle";


export default class Mesh extends GameObject {

    public triangles: Array<Triangle>;

    constructor();
    constructor(position: Vec3, rotation: Vec3);
    constructor(position?: Vec3, rotation?: Vec3) {
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

        let material: Color;
        let hsvMaterial: HSVColor;

        let lightIntensity: number;

        ctx.strokeStyle = "WHITE";
        
        const cameraForward: Vec3 = camera.forward();
        const lightNormalArr: Array<Vec3> = lights.map(light => light.forward());

        const drawingTriangle: Array<Triangle> = new Array<Triangle>();

        // console.log(cameraForward);

        for(let i = 0; i < this.triangles.length; i+=1) {
            triangle = this.triangles[i];

            rotated_p1 = rotateCs(triangle.points[0], this.cos, this.sin);
            rotated_p2 = rotateCs(triangle.points[1], this.cos, this.sin);
            rotated_p3 = rotateCs(triangle.points[2], this.cos, this.sin);

            translated_1 = vec3xVec3AddR(rotated_p1, this.position);
            translated_2 = vec3xVec3AddR(rotated_p2, this.position);
            translated_3 = vec3xVec3AddR(rotated_p3, this.position);

            center  = vec3xNumDivR(vec3xVec3AddR(vec3xVec3AddR(translated_1, translated_2), translated_3), 3);
            
            cameraDiff = vec3xVec3SubR(center, camera.position);


            v21 = vec3xVec3SubR(translated_2, translated_1);
            v31 = vec3xVec3SubR(translated_3, translated_1);

            norm = vec3Cross(v21, v31);

            dProduct = vec3Dot(norm, cameraDiff);
            
            triangle.avgZ = Math.min(vec3SqrMagnitude(vec3xVec3SubR(translated_1, camera.position)),
                                     vec3SqrMagnitude(vec3xVec3SubR(translated_2, camera.position)),
                                     vec3SqrMagnitude(vec3xVec3SubR(translated_3, camera.position)));

            if (dProduct < 0) {
                
                triangle.normal = norm;
                triangle.cameraPoints = [translated_1, translated_2, translated_3];

                drawingTriangle.push(triangle);
            }
        }

        drawingTriangle.sort((a, b) => b.avgZ - a.avgZ);

        for(let i = 0; i < drawingTriangle.length; i+=1) {
            triangle = drawingTriangle[i];

            uv1 = camera.worldToScreenPoint(triangle.cameraPoints[0]);
            uv2 = camera.worldToScreenPoint(triangle.cameraPoints[1]);
            uv3 = camera.worldToScreenPoint(triangle.cameraPoints[2]);

            lightIntensity = 0;

            material = triangle.material;

            hsvMaterial = rgbToHsv(material);

            for(let j = 0; j < lights.length; ++j)
            {
                lightIntensity += this.getLightIntensity(vec3Normal(triangle.normal), lightNormalArr[j]) * lights[j].intensity;
            }

            hsvMaterial.v = hsvMaterial.v * Math.min(lightIntensity, 1);
            

            material = hsvToRgb(hsvMaterial);


            


            ctx.fillStyle = rgbToString(material);
            ctx.strokeStyle = rgbToString(material);

            ctx.beginPath();
            ctx.moveTo(uv1.x, uv1.y);
            ctx.lineTo(uv2.x, uv2.y);
            ctx.lineTo(uv3.x, uv3.y);
            ctx.lineTo(uv1.x, uv1.y);
            ctx.fill();

            ctx.stroke();
            // ctx.stroke();

        }
    }
}
