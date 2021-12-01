import { Color, HSVColor, hsvToRgb, rgbToHsv, rgbToString } from "../utils/color";
import { Vec2, Vec3, vec3Cross, vec3Dot, vec3Normal, vec3SqrMagnitude, vec3xNumDivR, vec3xNumMulR, vec3xVec3AddR, vec3xVec3SubR } from "../utils/vecUtils";
import { Camera } from "./camera";
import { Component } from "./component";
import { rotateCs } from "./engine";
import GameObject from "./gameobject";
import { Light } from "./light";
import { Triangle } from "./triangle";


export default class Mesh extends Component {

    public triangles: Array<Triangle>;

    public gameObject: GameObject;

    constructor(gameObject: GameObject) {
        super(gameObject);

        this.triangles = new Array<Triangle>();
    }

    getAvgZ(): number {
        return this.triangles.map(tri => tri.avgZ).reduce((a, b) => a + b) / this.triangles.length;
    }

    getLightIntensity(surfaceNormal: Vec3, lightNormal: Vec3): number {
        let dotProduct = vec3Dot(surfaceNormal, lightNormal);

        // if the dot product is >= 0 that means the surface normal and the light normal
        // are in the same direction
        return dotProduct >= 0 ? 0 : -dotProduct;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera, lights: Array<Light>) {
        // Calculate the cos, sin of the mesh to avoid recalculating
        this.gameObject.transform.calculateCs();

        // Declaring needed variables to avoid re-declaration, "giving the garbage collector a break"
        let triangle: Triangle;
        let uv1: Vec2, uv2: Vec2, uv3: Vec2;
        let rotated_p1: Vec3, rotated_p2: Vec3, rotated_p3: Vec3;
        let scaled_1: Vec3, scaled_2: Vec3, scaled_3: Vec3;
        let translated_1: Vec3, translated_2: Vec3, translated_3: Vec3;
        let center: Vec3;
        let cameraDiff: Vec3;
        let v21: Vec3, v31: Vec3;
        let norm: Vec3;
        let dProduct: number;

        let material: Color;
        let hsvMaterial: HSVColor;

        let lightIntensity: number;
        // ------------------------------------------------------------------------------------------

        // Calculating the normal of every light source in the scene TODO: move this to the drawScene renderer
        const lightNormalArr: Array<Vec3> = lights.map(light => light.transform.forward());

        // An array to store the visible triangles
        const drawingTriangle: Array<Triangle> = new Array<Triangle>();

        // console.log(cameraForward);

        for(let i = 0; i < this.triangles.length; i+=1) {
            triangle = this.triangles[i];

            // Scaling the triangle // TODO: Make this a precalculated attribute for optimization
            scaled_1 = vec3xNumMulR(triangle.points[0], this.transform.scale);
            scaled_2 = vec3xNumMulR(triangle.points[1], this.transform.scale);
            scaled_3 = vec3xNumMulR(triangle.points[2], this.transform.scale);


            // Rotating the triangle points
            rotated_p1 = rotateCs(scaled_1, this.transform.cos, this.transform.sin);
            rotated_p2 = rotateCs(scaled_2, this.transform.cos, this.transform.sin);
            rotated_p3 = rotateCs(scaled_3, this.transform.cos, this.transform.sin);

            // Translating the triangle points
            translated_1 = vec3xVec3AddR(rotated_p1, this.transform.position);
            translated_2 = vec3xVec3AddR(rotated_p2, this.transform.position);
            translated_3 = vec3xVec3AddR(rotated_p3, this.transform.position);

            // Calculating the center point (translated_1 + translated_2 + translated_3) / 3
            center  = vec3xNumDivR(vec3xVec3AddR(vec3xVec3AddR(translated_1, translated_2), translated_3), 3);
            
            // Center - Camera position
            cameraDiff = vec3xVec3SubR(center, camera.transform.position);

            // Calculating the cross product -----------------
            v21 = vec3xVec3SubR(translated_2, translated_1);
            v31 = vec3xVec3SubR(translated_3, translated_1);

            norm = vec3Cross(v21, v31);
            // -----------------------------------------------

            // Dot product between normal and the cam - center
            dProduct = vec3Dot(norm, cameraDiff);
            
            // triangle average Z is the minimum between the points distance from the camera
            // using the (distance^2) to avoid the sqrt calculating as it takes more time to calculate
            triangle.avgZ = Math.min(vec3SqrMagnitude(vec3xVec3SubR(translated_1, camera.transform.position)),
                                     vec3SqrMagnitude(vec3xVec3SubR(translated_2, camera.transform.position)),
                                     vec3SqrMagnitude(vec3xVec3SubR(translated_3, camera.transform.position)));


            // if the DotProduct between normal and the cam - center
            // is less than 0, it means the triangle is behind the camera
            if (dProduct < 0) {
                
                triangle.normal = norm;
                
                triangle.cameraPoints = [translated_1, translated_2, translated_3];
                
                // Adding the triangle to the visible triangles array
                drawingTriangle.push(triangle);
            }
        }

        // Sorting the visible triangle before drawing them
        drawingTriangle.sort((a, b) => b.avgZ - a.avgZ);

        for(let i = 0; i < drawingTriangle.length; i+=1) {
            triangle = drawingTriangle[i];

            // Calculating the uv points for each point
            uv1 = camera.worldToScreenPoint(triangle.cameraPoints[0]);
            uv2 = camera.worldToScreenPoint(triangle.cameraPoints[1]);
            uv3 = camera.worldToScreenPoint(triangle.cameraPoints[2]);

            // If any of the points Z position is === to the camera Z position don't draw the triangle
            if(!uv1 || !uv2 || !uv3)continue;

            // Initial light intensity
            lightIntensity = 0;

            // material is the triangle color
            material = triangle.material;

            // Getting the HSV values from the rgb colors
            hsvMaterial = rgbToHsv(material);

            // For each light in the scene
            for(let j = 0; j < lights.length; ++j)
            {
                // adding the light intensity emitted 
                lightIntensity += this.getLightIntensity(vec3Normal(triangle.normal), lightNormalArr[j]) * lights[j].intensity;
            }

            // Changing the V value of the color based on the light intensity
            hsvMaterial.v = hsvMaterial.v * Math.min(lightIntensity, 1);
            
            // Converting the color back to RGB
            material = hsvToRgb(hsvMaterial);


            

            // FINALLY DRAW
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
