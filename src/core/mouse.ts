

// A static class to get, store, remove mouse clicks
export class Mouse {
    static heldKeys: Map<number, undefined> = new Map<number, undefined>();
    

    private static AddKey(key: number) {
        Mouse.heldKeys.set(key, undefined);
        
    }

    private static RemoveKey(key: number) {
        Mouse.heldKeys.delete(key);
    }


    static GetKeyDown(key: number): boolean {
        return this.heldKeys.has(key);
    }


    static KeyHandler(e: MouseEvent) {
        // Registering key strokes 
        if(e.type == "mousedown") Mouse.AddKey(e.button);
        else if(e.type == "mouseup") Mouse.RemoveKey(e.button);
    }
}