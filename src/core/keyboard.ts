

// A static class to get, store, remove key strokes
export class Keyboard {
    static heldKeys: Map<string, undefined> = new Map<string, undefined>();
    

    static AddKey(key: string) {
        Keyboard.heldKeys.set(key, undefined);
    }

    static RemoveKey(key: string) {
        Keyboard.heldKeys.delete(key);
    }



    static KeyHandler(e: KeyboardEvent) {
        // Registering key strokes 
        if(e.type == "keydown") Keyboard.AddKey(e.key);
        else if(e.type == "keyup") Keyboard.RemoveKey(e.key);
    }
}