import setDraggable from "./common/draggable";
import Time from "./common/time";
import Scene from "./scene";
import { FRAGMENT_SHADER } from "./shaders/fragmentshader";
import { VERTEX_SHADER } from "./shaders/vertexshader";
import { Color, rgbNormal } from "./utils/color";

export default class Renderer {
    static instance: Renderer;

    rendererSettings: RendererSettings;

    others: Object;

    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;

    webglProgram: WebGLProgram;

    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;

    positionBuffer: WebGLBuffer;
    rotationBuffer: WebGLBuffer;
    normalBuffer: WebGLBuffer;
    vertexBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;

    camPositionUniformLocation: WebGLUniformLocation;
    camRotationUniformLocation: WebGLUniformLocation;

    positionGrid: Float32Array;
    rotationGrid: Float32Array;
    normalGrid: Float32Array;
    vertexGrid: Float32Array;
    colorGrid: Float32Array;

    scene: Scene;
    time: Time;

    constructor(scene: Scene);
    constructor(scene: Scene, canvas_id: string);
    constructor(scene: Scene, canvas_id: string, settings: RendererSettings);
    constructor(scene: Scene, canvas_id?: string, settings?: RendererSettings) {
        if (Renderer.instance != null) {
            alert("A renderer instance already exists");
            return;
        }
        Renderer.instance = this;

        this.rendererSettings = settings;
        this.others = new Object();

        this.scene = scene;

        this.loadCanvas(canvas_id);
        if (this.rendererSettings?.showfps) {
            let container = this.canvas.parentElement;
            let fpsdiv = document.createElement("div");
            fpsdiv.classList.add("fps");
            container.appendChild(fpsdiv);
            this.others["fpsdiv"] = fpsdiv;
        }

        // @ts-ignore
        this.gl = this.canvas.getContext("webgl");

        if (!this.gl) {
            alert("WebGL is not supported by your browser");
            return;
        }

        const points = this.scene.meshes.map((mesh) => mesh.triangles.length).reduce((a,b) => a+b) * 9;

        this.positionGrid = new Float32Array(points);
        this.rotationGrid = new Float32Array(points);
        this.normalGrid = new Float32Array(points);
        this.vertexGrid = new Float32Array(points);
        this.colorGrid = new Float32Array(points);

        this.setupWebGL();

        // setDraggable(this.canvas, this.scene.onMouseDrag, this.scene);

        var self = this;
        document.onkeydown = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        };

        document.onkeyup = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        };

        /**
         *
         */
        this.setClearColor(0, 0, 0, 0);

        this.time = new Time();

        requestAnimationFrame(() => {
            this.render();
        });
    }

    render() {
        this.time.flag();
        if (this.rendererSettings?.showfps) {
            this.others["fpsdiv"].innerHTML = this.time.fps;
        }

        this.scene.updateScene(this.time.dt / 1000);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // this.scene.update();

        let i = 0;

        const position_array = [];
        const rotation_array = [];
        const normal_array = [];
        const points_array = [];
        const colors_array = [];

        let rgb_normal: Color;
        const self = this;
        
        this.gl.uniform3f(this.camPositionUniformLocation, 
                this.scene.camera.position.x,
                this.scene.camera.position.y,
                this.scene.camera.position.z);
        
        this.gl.uniform3f(this.camRotationUniformLocation, 
                this.scene.camera.rotation.x,
                this.scene.camera.rotation.y,
                this.scene.camera.rotation.z);


        this.scene.meshes.sort((a, b) => a.getAvgZ() - b.getAvgZ());

        this.scene.meshes.forEach((mesh) => {
            mesh.triangles.forEach(tri=>{
                tri.points.forEach(pt => {
                    ++i;
                    rgb_normal = rgbNormal(tri.material);

                    position_array.push(mesh.position.x, mesh.position.y, mesh.position.z);
                    rotation_array.push(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
                    colors_array.push(rgb_normal.r, rgb_normal.g, rgb_normal.b);
                    points_array.push(pt.x, pt.y, pt.z);
                })
            });
        });
        
        this.updateBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer, new Float32Array(position_array));
        this.updateBuffer(this.gl.ARRAY_BUFFER, this.rotationBuffer, new Float32Array(rotation_array));
        this.updateBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer, new Float32Array(points_array));
        this.updateBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer, new Float32Array(colors_array));

        this.gl.drawArrays(this.gl.TRIANGLES, 0, i);

        requestAnimationFrame(() => {
            this.render();
        });
    }

    loadCanvas(canvas_id: string) {
        this.canvas = document.querySelector(`#${canvas_id}`);

        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.id = "#og_renderer";
            document.body.append(this.canvas);
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.scene.world.WIDTH = this.canvas.width;
        this.scene.world.HEIGHT = this.canvas.height;
    }

    createShader(type: number, src: string): WebGLShader {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw `${type == this.gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER"} [COMPILE_ERROR]: ${this.gl.getShaderInfoLog(shader)}`;
        }
        return shader;
    }

    createProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vert);
        this.gl.attachShader(program, frag);

        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw `"PROGRAM [LINK_ERROR]: ${this.gl.getProgramInfoLog(program)}`;
        }

        this.gl.validateProgram(program);
        this.gl.useProgram(program);

        return program;
    }

    createBuffer(target: number, srcData: BufferSource, usage: number, location: string, size: number, type: number): WebGLBuffer {
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, srcData, usage);

        let attrLoc = this.gl.getAttribLocation(this.webglProgram, location);
        this.gl.vertexAttribPointer(attrLoc, size, type, false, 0, 0);
        this.gl.enableVertexAttribArray(attrLoc);

        return buffer;
    }

    updateBuffer(target: number, buffer: WebGLBuffer, srcData: BufferSource, offset: number = 0) {
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferSubData(target, offset, srcData);
    }

    setupWebGL() {
        try {
            this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
            this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

            this.webglProgram = this.createProgram(this.vertexShader, this.fragmentShader);

            // TODO: DYNAMIC_DRAW
            this.positionBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.positionGrid, this.gl.STATIC_DRAW, "a_position", 3, this.gl.FLOAT);
            this.rotationBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.rotationGrid, this.gl.STATIC_DRAW, "a_rotation", 3, this.gl.FLOAT);
            this.normalBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.normalGrid, this.gl.STATIC_DRAW, "a_normal", 3, this.gl.FLOAT);
            this.vertexBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.vertexGrid, this.gl.STATIC_DRAW, "a_point", 3, this.gl.FLOAT);
            this.colorBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.colorGrid, this.gl.STATIC_DRAW, "a_color", 3, this.gl.FLOAT);

            this.camPositionUniformLocation = this.gl.getUniformLocation(this.webglProgram, "u_camPosition");
            this.camRotationUniformLocation = this.gl.getUniformLocation(this.webglProgram, "u_camRotation");
            
            let widthHeightUniformLocation = this.gl.getUniformLocation(this.webglProgram, "u_size");
            let lightUniformLocation = this.gl.getUniformLocation(this.webglProgram, "u_lightNormal");
            let fovUniformLocation = this.gl.getUniformLocation(this.webglProgram, "u_f");

            const lightForward = this.scene.lights[0].forward();
            this.gl.uniform3f(lightUniformLocation, lightForward.x, lightForward.y, lightForward.z);
            this.gl.uniform2f(widthHeightUniformLocation, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(fovUniformLocation, this.scene.camera.config.F)
        } catch (e) {
            console.error(e);
        }
    }

    getBoundRect(): DOMRect {
        return this.canvas.getBoundingClientRect();
    }

    setClearColor(r: number, g: number, b: number, a?: number) {
        this.gl.clearColor(r, g, b, a || 1.0);
    }
}
