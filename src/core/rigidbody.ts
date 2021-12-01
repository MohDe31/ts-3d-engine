import { DRAG } from "../constants";
import { Vec2, vec2Set, vec2xNumMulR, vec2xVec2Add } from "../utils/vecUtils";
import { Component } from "./component";
import GameObject from "./gameobject";


// A rigidbody is a gameobject that has physics
export class RigidBody2D extends Component {
    
    private force: Vec2;
    private acceleration: Vec2;
    public velocity: Vec2;

    constructor(gameObject: GameObject){
        super(gameObject);

        this.acceleration = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.force = {x: 0, y: 0};
    }

    update() {
        vec2xVec2Add(this.velocity, this.force);

        this.transform.position.x += this.velocity.x;
        this.transform.position.z += this.velocity.y;

        vec2Set(this.force       , 0, 0);
        vec2Set(this.acceleration, 0, 0);

        this.addForce(vec2xNumMulR(this.velocity, -DRAG));
    }

    addForce(force: Vec2) {
        vec2xVec2Add(this.force, force);
    }
    
}