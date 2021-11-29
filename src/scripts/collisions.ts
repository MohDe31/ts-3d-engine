import { Component } from "../core/component";
import GameObject from "../core/gameobject";
import { Ball } from "./ball";

export class BallCollisionHandler extends Component {

    public balls: Array<Ball>;

    constructor(gameObject: GameObject){
        super(gameObject);

        this.balls = new Array<Ball>();
    }


    update(){
        this.checkBallCollision();
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
    
    checkHoleCollision() {
        for(let i = 0; i < this.balls.length; i+=1)
        {
            // LOOP OVER HOLES
        }
    }
}

