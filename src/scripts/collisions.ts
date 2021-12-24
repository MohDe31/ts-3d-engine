import { Component } from "../core/component";
import GameObject from "../core/gameobject";
import { Transform } from "../core/transform";
import { Vec2, vec2SqrMagnitude, vec2xVec2SubR } from "../utils/vecUtils";
import { Ball } from "./ball";

export class BallCollisionHandler extends Component {

    public balls: Array<Ball>;
    public holes: Array<Transform>;

    constructor(gameObject: GameObject){
        super(gameObject);

        this.balls = new Array<Ball>();
        this.holes = new Array<Transform>();
    }


    update(){
        this.checkBallCollision();
        this.checkTableCollisions();
        this.checkHoleCollision();
    }
    
    
    checkBallCollision() {
        for(let i = 0; i < this.balls.length; i+=1)
        for(let j = i + 1; j < this.balls.length; j+=1)
        {
            const b1: Ball = this.balls[i];
            const b2: Ball = this.balls[j];
            
            b1.checkCollision(b2)
        }
    }

    checkTableCollisions(){
        for(let i = 0; i < this.balls.length; i+=1){
            const next_x: number = this.balls[i].transform.position.x + this.balls[i].rigidBody.velocity.x;
            const next_y: number = this.balls[i].transform.position.z + this.balls[i].rigidBody.velocity.y;

            if (next_x + this.balls[i].radius > 16){
                this.balls[i].rigidBody.velocity.x *= -1;
            }else if (next_x < -15){
                this.balls[i].rigidBody.velocity.x *= -1;
            }


            if (next_y + this.balls[i].radius > 34){
                this.balls[i].rigidBody.velocity.y *= -1;
            }else if (next_y < -33){
                this.balls[i].rigidBody.velocity.y *= -1;
            }
        }
    }
        
    checkHoleCollision() {
        for(let i = 0; i < this.balls.length; i+=1) {
            const ballPosition: Vec2 = {x: this.balls[i].transform.position.x, y: this.balls[i].transform.position.z};

            for(let j = 0; j < this.holes.length; j+=1){
                const holePosition: Vec2 = {x: this.holes[j].position.x, y: this.holes[j].position.z};
                if(vec2SqrMagnitude(vec2xVec2SubR(ballPosition, holePosition)) < this.balls[i].radius * 1.5){
                    this.balls[i].pot();
                }
            }
        }
    }
}

