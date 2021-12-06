import { Component } from "../core/component";
import GameObject from "../core/gameobject";
import Mesh from "../core/mesh";
import { Time } from "../core/time";
import { Vec3, vec3Normal, vec3xNumMulR, vec3xVec3Sub, vec3xVec3SubR } from "../utils/vecUtils";




export class SphereVisualization extends Component {


    private mesh: Mesh;

    constructor(gameObject: GameObject){
        super(gameObject);

        this.mesh = this.gameObject.getComponent(Mesh) as Mesh;
    }

    update(){
        this.mesh.triangles.forEach(triangle => {
            let n0: Vec3 = vec3Normal(triangle.points[0]);
            let n1: Vec3 = vec3Normal(triangle.points[1]);
            let n2: Vec3 = vec3Normal(triangle.points[2]);

            n0 = vec3xNumMulR(vec3xVec3SubR(triangle.points[0], n0), Time.FixedDeltaTime * .1);
            n1 = vec3xNumMulR(vec3xVec3SubR(triangle.points[1], n1), Time.FixedDeltaTime * .1);
            n2 = vec3xNumMulR(vec3xVec3SubR(triangle.points[2], n2), Time.FixedDeltaTime * .1);

            vec3xVec3Sub(triangle.points[0], n0);
            vec3xVec3Sub(triangle.points[1], n1);
            vec3xVec3Sub(triangle.points[2], n2);
        });
    }
}