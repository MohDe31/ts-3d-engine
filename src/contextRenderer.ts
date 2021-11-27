import Time from "./common/time";
import Scene from "./scene";

export default class ContextRenderer {
    
    static instance: ContextRenderer;

    rendererSettings: RendererSettings;

    others: Object;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    
    scene: Scene;
    time: Time;


    constructor(scene: Scene);
    constructor(scene: Scene, canvas_id: string);
    constructor(scene: Scene, canvas_id: string, settings: RendererSettings);
    constructor(scene: Scene, canvas_id?: string, settings?: RendererSettings) {
        // Only needs one instance of this class
        if (ContextRenderer.instance != null) {
            alert("A renderer instance already exists");
            return;
        }
        ContextRenderer.instance = this;

        this.rendererSettings = settings;
        this.others = new Object();

        this.scene = scene;

        this.loadCanvas(canvas_id);

        // Flip the canvas.
        this.canvas.style.transform = 'scale(1, -1)';

        // this.canvas.style.transform = 'rotate(180deg)';
        
        // If the show fps boolean is true then create a new div to show the FPS
        if (this.rendererSettings?.showfps) {
            let container = this.canvas.parentElement;
            let fpsdiv = document.createElement("div");
            fpsdiv.classList.add("fps");
            container.appendChild(fpsdiv);
            this.others["fpsdiv"] = fpsdiv;
        }

        // @ts-ignore
        this.ctx = this.canvas.getContext("2d");
        var self = this;

        // ----------Initializing key listeners-------------
        document.onkeydown = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        };

        document.onkeyup = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        }
        // -------------------------------------------------

        // Create a instance of the time class
        this.time = new Time();

        requestAnimationFrame(() => {
            this.render();
        });
    }

    render() {
        // Flag to calculate the FPS, delta-time
        this.time.flag();

        if (this.rendererSettings?.showfps) {
            // Update the FPS
            this.others["fpsdiv"].innerHTML = this.time.fps;
        }

        // Clear Color
        this.ctx.fillStyle = "BLACK";

        // Clear the canvas
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.scene.update(this.time.dt / 1000);

        // Draw the current Scene
        this.scene.drawScene(this.ctx);

        // Request a new frame
        requestAnimationFrame(() => {
            this.render();
        })
    }

    // Get the canvas element based on the ID
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
}
