import { Vec2 } from "../utils/vecUtils";


// A static class to get, store, remove mouse clicks
export class Mouse {
    private static heldKeys: Map<number, undefined> = new Map<number, undefined>();

    private static mousePosition: Vec2 = {x: 0, y: 0};
    private static mouseMovement: Vec2 = {x: 0, y: 0};
    

    private static AddKey(key: number) {
        Mouse.heldKeys.set(key, undefined);
        
    }

    private static RemoveKey(key: number) {
        Mouse.heldKeys.delete(key);
    }


    static GetKeyDown(key: number): boolean {
        return Mouse.heldKeys.has(key);
    }

    static GetMouseMovements(): Vec2 {
        return this.mouseMovement;
    }

    static PositionHandler(e: MouseEvent) {
        Mouse.mousePosition.x += e.movementX;
        Mouse.mousePosition.y += e.movementY;

        Mouse.mouseMovement.x = e.movementX;
        Mouse.mouseMovement.y = e.movementY;
    }


    static KeyHandler(e: MouseEvent) {
        // Registering key strokes 
        if(e.type == "mousedown") Mouse.AddKey(e.button);
        else if(e.type == "mouseup") Mouse.RemoveKey(e.button);
    }
}