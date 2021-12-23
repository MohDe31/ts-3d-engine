import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import { Time } from "./time";
import Scene from "./scene";
import { FRAGMENT_SHADER } from "../shaders/fragmentshader";
import { VERTEX_SHADER } from "../shaders/vertexshader";
import { Color, rgbNormal } from "../utils/color";
import { Vec3 } from "../utils/vecUtils";
import Mesh from "./mesh";
import { Triangle } from "./triangle";



export namespace Renderer {
    export let initialized: boolean;

    export let others: Object;

    export let canvas: HTMLCanvasElement;
    export let gl: WebGL2RenderingContext;

    export let webglProgram: WebGLProgram;

    export let vertexShader: WebGLShader;
    export let fragmentShader: WebGLShader;

    export let normalBuffer: WebGLBuffer;
    export let vertexBuffer: WebGLBuffer;
    export let colorBuffer: WebGLBuffer;

    export let clearColor: Color = {r: 0, g: 0, b: 0};

    export let camPositionUniformLocation: WebGLUniformLocation;
    export let camRotationUniformLocation: WebGLUniformLocation;

    export let normalGrid: Float32Array;
    export let vertexGrid: Float32Array;
    export let colorGrid: Float32Array;

    export let debugContent: Array<DebugContent>;

    export let scene: Scene;

    export function init(scene: Scene, canvas_id?: string, ...debugContent: Array<DebugContent>) {
        if (Renderer.initialized) {
            alert("A renderer instance already exists");
            return;
        }

        Renderer.debugContent = debugContent;

        Renderer.others = new Object();

        Renderer.scene = scene;

        Renderer.loadCanvas(canvas_id);

        Renderer.others["fpsdiv"] = document.querySelector("#fps");
        Renderer.others["debug-console"] = document.querySelector("#debug-list");
        for(let i = 0; i < debugContent.length; i+=1){
            Renderer.others[i] = document.createElement('li');
            Renderer.others["debug-console"].appendChild(Renderer.others[i]);
        };


        // @ts-ignore
        Renderer.gl = Renderer.canvas.getContext("webgl");

        if (!Renderer.gl) {
            alert("WebGL is not supported by your browser");
            return;
        }

        const points = Renderer.scene.meshes.map((mesh) => mesh.triangles.length).reduce((a,b) => a+b) * 9;

        Renderer.normalGrid = new Float32Array(points);
        Renderer.vertexGrid = new Float32Array(points);
        Renderer.colorGrid = new Float32Array(points);

        Renderer.setupWebGL();

        // ----------Initializing key listeners-------------
        document.onkeydown = function (e: KeyboardEvent) {
            Keyboard.KeyHandler(e);
        };

        document.onkeyup = function (e: KeyboardEvent) {
            Keyboard.KeyHandler(e);
        };

        document.onmousedown = function (e: MouseEvent) {
            Mouse.KeyHandler(e);
        };

        document.onmouseup = function (e: MouseEvent) {
            Mouse.KeyHandler(e);
        };

        // -------------------------------------------------

        /**
         *
         */
        
        Renderer.clearColor = rgbNormal(Renderer.clearColor);
        Renderer.gl.clearColor(Renderer.clearColor.r,
                               Renderer.clearColor.g,
                               Renderer.clearColor.b, 1.0);

        requestAnimationFrame(Renderer.render);
    }

    export function render(time: number) {
        Time.updateDeltaTime(time);
        
        Renderer.others["fpsdiv"].innerHTML = `FPS: ${Time.FPS}`;
        for(let i = 0; i < Renderer.debugContent.length; i+=1) {
            const content: DebugContent = Renderer.debugContent[i];

            if(content.message) Renderer.others[i].innerText = `${content.message}: `;
            else Renderer.others[i].innerText = "";
        
            switch(content.type){
                case "VEC3":
                    Renderer.others[i].innerText += `${content.object.x.toFixed(2)} ${content.object.y.toFixed(2)} ${content.object.z.toFixed(2)}`;
                    break;
            }
        }
        
        
        

        Renderer.scene.update();

        Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT );

        let i = 0;

        const normal_array = [];
        const points_array = [];
        const colors_array = [];

        let rgb_normal: Color;

        
        Renderer.gl.uniform3f(Renderer.camPositionUniformLocation, 
                Renderer.scene.camera.transform.position.x,
                Renderer.scene.camera.transform.position.y,
                Renderer.scene.camera.transform.position.z);
        
        Renderer.gl.uniform3f(Renderer.camRotationUniformLocation, 
                Renderer.scene.camera.transform.rotation.x,
                Renderer.scene.camera.transform.rotation.y,
                Renderer.scene.camera.transform.rotation.z);

        const triangles: Array<Triangle> = new Array<Triangle>();

        Renderer.scene.meshes.forEach(function(mesh: Mesh){
            mesh.updateTriangles(Renderer.scene.camera);

            triangles.push(...mesh.triangles.filter(function(triangle: Triangle){
                return triangle.dProduct < 0;
            }));
        });


        triangles.sort((b, a) => a.avgZ - b.avgZ);

        triangles.forEach(function(triangle: Triangle) {
            rgb_normal = rgbNormal(triangle.material);
            triangle.cameraPoints.forEach(pt => {
                ++i;
                colors_array.push(rgb_normal.r, rgb_normal.g, rgb_normal.b);
                normal_array.push(triangle.normal.x, triangle.normal.y, triangle.normal.z);
                points_array.push(pt.x, pt.y, pt.z);
            })
        });
        
        Renderer.updateBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.vertexBuffer, new Float32Array(points_array));
        Renderer.updateBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.normalBuffer, new Float32Array(normal_array));
        Renderer.updateBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.colorBuffer, new Float32Array(colors_array));

        Renderer.gl.drawArrays(Renderer.gl.TRIANGLES, 0, i);

        requestAnimationFrame(Renderer.render);
    }

    export function loadCanvas(canvas_id: string) {
        Renderer.canvas = document.querySelector(`#${canvas_id}`);

        if (!Renderer.canvas) {
            Renderer.canvas = document.createElement("canvas");
            Renderer.canvas.id = "#og_renderer";
            document.body.append(Renderer.canvas);
        }

        Renderer.canvas.width = window.innerWidth;
        Renderer.canvas.height = window.innerHeight;

        Renderer.scene.world.WIDTH = Renderer.canvas.width;
        Renderer.scene.world.HEIGHT = Renderer.canvas.height;
    }

    export function createShader(type: number, src: string): WebGLShader {
        let shader = Renderer.gl.createShader(type);
        Renderer.gl.shaderSource(shader, src);
        Renderer.gl.compileShader(shader);

        if (!Renderer.gl.getShaderParameter(shader, Renderer.gl.COMPILE_STATUS)) {
            throw `${type == Renderer.gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER"} [COMPILE_ERROR]: ${Renderer.gl.getShaderInfoLog(shader)}`;
        }
        return shader;
    }

    export function createProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
        let program = Renderer.gl.createProgram();
        Renderer.gl.attachShader(program, vert);
        Renderer.gl.attachShader(program, frag);

        Renderer.gl.linkProgram(program);

        if (!Renderer.gl.getProgramParameter(program, Renderer.gl.LINK_STATUS)) {
            throw `"PROGRAM [LINK_ERROR]: ${Renderer.gl.getProgramInfoLog(program)}`;
        }

        Renderer.gl.validateProgram(program);
        Renderer.gl.useProgram(program);

        return program;
    }

    export function createBuffer(target: number, srcData: BufferSource, usage: number, location: string, size: number, type: number): WebGLBuffer {
        let buffer = Renderer.gl.createBuffer();
        Renderer.gl.bindBuffer(target, buffer);
        Renderer.gl.bufferData(target, srcData, usage);

        let attrLoc = Renderer.gl.getAttribLocation(Renderer.webglProgram, location);
        Renderer.gl.vertexAttribPointer(attrLoc, size, type, false, 0, 0);
        Renderer.gl.enableVertexAttribArray(attrLoc);

        return buffer;
    }

    export function updateBuffer(target: number, buffer: WebGLBuffer, srcData: BufferSource, offset: number = 0) {
        Renderer.gl.bindBuffer(target, buffer);
        Renderer.gl.bufferSubData(target, offset, srcData);
    }

    export function setupWebGL() {
        try {
            Renderer.vertexShader = Renderer.createShader(Renderer.gl.VERTEX_SHADER, VERTEX_SHADER);
            Renderer.fragmentShader = Renderer.createShader(Renderer.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

            Renderer.webglProgram = Renderer.createProgram(Renderer.vertexShader, Renderer.fragmentShader);

            // TODO: DYNAMIC_DRAW
            Renderer.vertexBuffer = Renderer.createBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.vertexGrid, Renderer.gl.STATIC_DRAW, "a_position", 3, Renderer.gl.FLOAT);
            Renderer.normalBuffer = Renderer.createBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.normalGrid, Renderer.gl.STATIC_DRAW, "a_normal", 3, Renderer.gl.FLOAT);
            Renderer.colorBuffer = Renderer.createBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.colorGrid, Renderer.gl.STATIC_DRAW, "a_color", 3, Renderer.gl.FLOAT);

            Renderer.camPositionUniformLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_camPosition");
            Renderer.camRotationUniformLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_camRotation");
            
            let widthHeightUniformLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_size");
            let fovUniformLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_f");
            let lightUniformLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_lights");
            let lightsCountLocation = Renderer.gl.getUniformLocation(Renderer.webglProgram, "u_lightsCount");

            const lightNormals: Array<number> = new Array<number>();

            Renderer.scene.lights.forEach((light) => {
                const forward: Vec3 = light.transform.forward();

                lightNormals.push(forward.x, forward.y, forward.z);
            });

            Renderer.gl.uniform1i(lightsCountLocation, Renderer.scene.lights.length);
            Renderer.gl.uniform3fv(lightUniformLocation, new Float32Array(lightNormals));
            Renderer.gl.uniform2f(widthHeightUniformLocation, Renderer.canvas.width, Renderer.canvas.height);
            Renderer.gl.uniform1f(fovUniformLocation, Renderer.scene.camera.config.F)
        } catch (e) {
            console.error(e);
        }
    }

    export function getBoundRect(): DOMRect {
        return Renderer.canvas.getBoundingClientRect();
    }

    export function setClearColor(r: number, g: number, b: number) {
        Renderer.clearColor.r = r;
        Renderer.clearColor.g = g;
        Renderer.clearColor.b = b;
    }
}
