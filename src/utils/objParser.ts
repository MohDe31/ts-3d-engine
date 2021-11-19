import { readFileSync } from 'fs';
import {parse, join} from "path";

import { Triangle } from '../graphics/triangle';
import { Vec3 } from './vecUtils';
import Mesh from "../graphics/mesh";
import { MaterialStore } from './material';
import { Color } from './color';


export function parseMat(path: string): MaterialStore {

    try{
        const content: string = readFileSync(path).toString();

        const matStore: MaterialStore = new Map<string, Color>();

        let matName: string;

        content.split("\n").forEach(function(line) {

            if(line.startsWith("newmtl")) {
                matName = line.split(" ")[1];
            }else if(line.startsWith("Kd ")) {
                const [r, g, b] = line.substr(3).split(" ").map(parseFloat);

                matStore.set(matName, { r: r * 255, g: g * 255, b: b * 255 });
            }

        });

        return matStore;
    }catch(error){
        console.log(error);
        return undefined;
    }
}

export function parseObj(path: string): Mesh {

    try {
        const content: string = readFileSync(path).toString();
        
        const verts: Array<number> = new Array<number>();
        const triangles: Array<Triangle> = new Array<Triangle>();

        const baseDir: string = parse(path).dir;

        let matStore: MaterialStore;
        let matFileName: string;
        let matPath: string;
        let matName: string = "(null)";

        let p1: Vec3, p2: Vec3, p3: Vec3;


        content.split('\n').forEach(function(line){
            
            if(line.startsWith("v ")) {
                verts.push(...line.substr(2).split(" ").map(parseFloat));
            }else if(line.startsWith("f ")) {
                const [i1, i2, i3] = line.substr(2).split(" ").map(parseFloat);
                p1 = {
                    x: verts[(i1 - 1) * 3],
                    y: verts[(i1 - 1) * 3 + 1],
                    z: verts[(i1 - 1) * 3 + 2]
                }

                p2 = {
                    x: verts[(i2 - 1) * 3],
                    y: verts[(i2 - 1) * 3 + 1],
                    z: verts[(i2 - 1) * 3 + 2]
                }

                p3 = {
                    x: verts[(i3 - 1) * 3],
                    y: verts[(i3 - 1) * 3 + 1],
                    z: verts[(i3 - 1) * 3 + 2]
                }
                
                triangles.push(new Triangle(p1, p2, p3, matStore != undefined && matStore.has(matName) ? matStore.get(matName) : undefined));
            }else if(line.startsWith("mtllib")){
                matFileName = line.split(" ")[1];

                matPath = join(baseDir, matFileName);

                matStore = parseMat(matPath);
            }else if(line.startsWith("usemtl") && matStore != undefined){
                matName = line.split(" ")[1];
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