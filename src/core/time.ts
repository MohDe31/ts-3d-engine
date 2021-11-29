export namespace Time {
    export const FixedDeltaTime : number = 0.029321;
    export let FPS: number;
    export let DeltaTime: number;

    let lastTime: number = 0;

    export function updateDeltaTime(time: number) {
        DeltaTime = (time - lastTime) / 1000;
        lastTime = time;


        FPS = (1 / Time.DeltaTime) >> 0;
    }
}
