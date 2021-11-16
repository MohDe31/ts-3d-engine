export default class Time {
    l_l: number;
    f_l: boolean;
    fps: number;
    dt : number;

    constructor() {
        this.l_l = 0;
        this.f_l = true;
    }

    flag() {
        if (this.f_l) {
            this.l_l = Date.now();
            this.f_l = false;
        }

        let t_t = Date.now();
        this.dt = (t_t - this.l_l);
        this.fps = (1000 / this.dt) >> 0;
        this.l_l = t_t;
    }
}
