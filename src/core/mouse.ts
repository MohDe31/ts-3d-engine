import { LockStatus } from "../utils/types";
import { Vec2 } from "../utils/vecUtils";


// A static class to get, store, remove mouse clicks
export class Mouse {
    private static heldKeys: Map<number, undefined> = new Map<number, undefined>();
    private static downKeys: Map<number, undefined> = new Map<number, undefined>();
    private static upKeys: Map<number, undefined> = new Map<number, undefined>();

    private static mousePosition: Vec2 = {x: 0, y: 0};
    private static mouseMovement: Vec2 = {x: 0, y: 0};
    
    private static _isLocked: LockStatus = { Locked: false };


    static get lockStatus(): LockStatus {
        return this._isLocked;
    }

    private static AddKey(key: number) {
        Mouse.heldKeys.set(key, undefined);
        Mouse.downKeys.set(key, undefined);
        
    }

    private static RemoveKey(key: number) {
        Mouse.heldKeys.delete(key);
        Mouse.upKeys.set(key, undefined);
    }


    static GetKey(key: number): boolean {
        return Mouse.heldKeys.has(key);
    }

    static GetKeyDown(key: number): boolean {
        return Mouse.downKeys.has(key);
    }

    static GetKeyUp(key: number): boolean {
        return Mouse.upKeys.has(key);
    }

    static GetMouseMovements(): Vec2 {
        return this.mouseMovement;
    }

    static clearMouseMovements(){
        Mouse.mouseMovement.x = 0;
        Mouse.mouseMovement.y = 0;
    }

    static clearMouseEvents(){
        Mouse.downKeys.clear();
        Mouse.upKeys.clear();
    }

    static PositionHandler(e: MouseEvent) {
        Mouse.mousePosition.x += e.movementX;
        Mouse.mousePosition.y += e.movementY;

        Mouse.mouseMovement.x = e.movementX;
        Mouse.mouseMovement.y = e.movementY;
    }


    static ToggleLock() {
        this._isLocked.Locked = !this._isLocked.Locked;
    }


    static KeyHandler(e: MouseEvent) {
        // Registering key strokes 
        if(e.type == "mousedown") Mouse.AddKey(e.button);
        else if(e.type == "mouseup") Mouse.RemoveKey(e.button);
    }
}