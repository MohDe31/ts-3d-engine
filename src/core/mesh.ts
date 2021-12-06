import { Component } from "./component";
import GameObject from "./gameobject";
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
}
