import { Time } from "./time";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import Scene from "./scene";

export namespace Renderer {
    
    export let initialized: boolean;
    export let rendererSettings: RendererSettings;

    export let others: Object;

    export let canvas: HTMLCanvasElement;
    export let ctx: CanvasRenderingContext2D;
    
    export let scene: Scene;

    export function init(scene: Scene, canvas_id?: string, settings?: RendererSettings) {
        // Only needs one instance of this class
        if (Renderer.initialized) {
            alert("A renderer instance already exists");
            return;
        }

        Renderer.initialized = true;

        Renderer.rendererSettings = settings;
        Renderer.others = new Object();

        Renderer.scene = scene;

        Renderer.loadCanvas(canvas_id);

        // Flip the canvas.
        Renderer.canvas.style.transform = 'scale(1, -1)';

        // this.canvas.style.transform = 'rotate(180deg)';
        
        // If the show fps boolean is true then create a new div to show the FPS
        if (Renderer.rendererSettings?.showfps) {
            let container = Renderer.canvas.parentElement;
            let fpsdiv = document.createElement("div");
            fpsdiv.classList.add("fps");
            container.appendChild(fpsdiv);
            Renderer.others["fpsdiv"] = fpsdiv;
        }

        // @ts-ignore
        Renderer.ctx = this.canvas.getContext("2d");

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
        requestAnimationFrame(Renderer.render);
    }

    export function render(time: number) {
        // Flag to calculate the FPS, delta-time
        Time.updateDeltaTime(time);

        if (Renderer.rendererSettings?.showfps) {
            // Update the FPS
            Renderer.others["fpsdiv"].innerHTML = Time.FPS;
        }
        

        Renderer.scene.update();

        // Clear Color
        Renderer.ctx.fillStyle = "BLACK";

        // Clear the canvas
        Renderer.ctx.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

        // Draw the current Scene
        Renderer.scene.drawScene(Renderer.ctx);

        // Request a new frame
        requestAnimationFrame(Renderer.render);
    }

    // Get the canvas element based on the ID
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
        Renderer.scene.world.HEIGHT = this.canvas.height;
    }
}