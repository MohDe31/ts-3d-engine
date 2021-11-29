import { Ball } from "./ball";


export function checkBallCollision(balls: Array<Ball>) {
    for(let i = 0; i < balls.length; i+=1)
    for(let j = i + 1; j < balls.length; j+=1)
    {
        const b1: Ball = balls[i];
        const b2: Ball = balls[j];        
        
        b1.checkCollision(b2)
    }
}

export function checkHoleCollision(balls: Array<Ball>) {
    for(let i = 0; i < balls.length; i+=1)
    {
        // LOOP OVER HOLES
    }
}

