import { readFileSync } from 'fs';
import { Triangle } from '../graphics/triangle';
import { Vec3 } from './vecUtils';
import Mesh from "../graphics/mesh";


export function parseObj(path: string): Mesh {

    try {
        const content: string = readFileSync(path).toString();
        
        const verts: Array<number> = new Array<number>();
        const triangles: Array<Triangle> = new Array<Triangle>();

        content.split('\n').forEach(function(line){
            
            if(line.startsWith("v ")) {
                verts.push(...line.substr(2).split(" ").map(parseFloat));
            }else if(line.startsWith("f ")) {
                const [i1, i2, i3] = line.substr(2).split(" ").map(parseFloat);
                const p1: Vec3 = {
                    x: verts[(i1 - 1) * 3],
                    y: verts[(i1 - 1) * 3 + 1],
                    z: verts[(i1 - 1) * 3 + 2]
                }

                const p2: Vec3 = {
                    x: verts[(i2 - 1) * 3],
                    y: verts[(i2 - 1) * 3 + 1],
                    z: verts[(i2 - 1) * 3 + 2]
                }

                const p3: Vec3 = {
                    x: verts[(i3 - 1) * 3],
                    y: verts[(i3 - 1) * 3 + 1],
                    z: verts[(i3 - 1) * 3 + 2]
                }
                
                triangles.push(new Triangle(p1, p2, p3));
            }
        });


        const out: Mesh = new Mesh({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
        out.triangles = triangles;

        console.log(out);
        
        
        return out;
        
    }catch(err)
    {
        console.log(err);
        
        console.error(`FILE: ${path} doesn't exist! `);
        return undefined;
    }
    
}