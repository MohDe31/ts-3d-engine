import { Component } from "../core/component";
import GameObject from "../core/gameobject";
import { RigidBody2D } from "../core/rigidbody";
import { Vec2, vec2Dot, vec2Magnitude, vec2Normal, vec2xNumMulR, vec2xVec2Add, vec2xVec2AddR, vec2xVec2SubR } from "../utils/vecUtils";


export class Ball extends Component {
    
    public rigidBody: RigidBody2D;

    public potted: boolean;
    public radius: number;

    constructor(gameObject: GameObject) {
        super(gameObject);
        
        this.potted = false;
        this.radius = 1;
        this.rigidBody = this.gameObject.getComponent(RigidBody2D) as RigidBody2D;
    }

    pot() { this.potted = true; }

    checkCollision(ball: Ball){
        const n: Vec2 = vec2xVec2SubR(this.transform.position, ball.transform.position);        

        
        const req_dist: number = this.radius + ball.radius
        const dist = vec2Magnitude(n);        

        if (dist > req_dist)
            return


        let mtd: number = (req_dist - dist) / 2

        const un: Vec2 = vec2Normal(n);

        vec2xVec2Add(this.transform.position, vec2xNumMulR(un, mtd));
        vec2xVec2Add(ball.transform.position, vec2xNumMulR(un, -mtd));

        // tangent vector
        const ut: Vec2 = {x: -un.y,
                          y: un.x};

        const v1n: number = vec2Dot(un, this.rigidBody.velocity);
        const v1t: number = vec2Dot(ut, this.rigidBody.velocity);

        const v2n: number = vec2Dot(un, ball.rigidBody.velocity);
        const v2t: number = vec2Dot(ut, ball.rigidBody.velocity);

        const v1nTag: Vec2 = vec2xNumMulR(un, v2n);
        const v1tTag: Vec2 = vec2xNumMulR(ut, v1t);

        const v2nTag: Vec2 = vec2xNumMulR(un, v1n);
        const v2tTag: Vec2 = vec2xNumMulR(ut, v2t);

        this.rigidBody.velocity = vec2xVec2AddR(v1nTag, v1tTag);
        ball.rigidBody.velocity = vec2xVec2AddR(v2nTag, v2tTag);
                
    }

}