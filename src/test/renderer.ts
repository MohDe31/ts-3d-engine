import { Ball } from "../scripts/ball";
import { TABLE_X, TABLE_Z } from "../scripts/constants";



export function drawGameObjects(ctx: CanvasRenderingContext2D, balls: Array<Ball>){
    ctx.fillStyle = "GREEN";
    ctx.fillRect(0, 0, TABLE_X, TABLE_Z);


    ctx.fillStyle = "BLACK";
    for(let i = 0; i < balls.length; i+=1) {
        const ball: Ball = balls[i];
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    }

}