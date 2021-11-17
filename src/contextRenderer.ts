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
        if (ContextRenderer.instance != null) {
            alert("A renderer instance already exists");
            return;
        }
        ContextRenderer.instance = this;

        this.rendererSettings = settings;
        this.others = new Object();

        this.scene = scene;

        this.loadCanvas(canvas_id);

        this.canvas.style.transform = 'scale(1, -1)';
        // this.canvas.style.transform = 'rotate(180deg)';
        

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

        document.onkeydown = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        };

        document.onkeyup = function (e: KeyboardEvent) {
            self.scene.keyHandler(e, e.key);
        }

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

        this.ctx.fillStyle = "YELLOW";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.scene.drawScene(this.ctx, this.time.dt / 1000);

        requestAnimationFrame(() => {
            this.render();
        })
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
}
