

// A static class to get, store, remove key strokes
export class Keyboard {
    static heldKeys: Map<string, undefined> = new Map<string, undefined>();
    

    static addKey(key: string) {
        Keyboard.heldKeys.set(key, undefined);
        
    }


    static removeKey(key: string) {
        Keyboard.heldKeys.delete(key);
    }
}