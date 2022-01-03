import { Transform } from "./transform";
import { Component } from "./component";
import { Vec3, vec3Set } from "../utils/vecUtils";

/**
 * The GameObject class is every object in the game, even if it has no mesh, its the core of the object,
 * it contains components to populate it
 */
export default class GameObject {
    private components: Array<Component>;
    public transform: Transform;
    public active: boolean;

    constructor();
    constructor(position: Vec3, rotation: Vec3);
    constructor(position?: Vec3, rotation?: Vec3)
    {
        this.components = new Array<Component>();

        this.transform = this.addComponent(Transform) as Transform;
    
        vec3Set(this.transform.position, position || {x: 0, y: 0, z: 0});
        vec3Set(this.transform.rotation, rotation || {x: 0, y: 0, z: 0});

        this.active = true;
    }

    update(){
        // TODO: Change this to a for loop
        this.components.forEach(comp => { 
            if(comp.enabled) comp.update();
        });
    }


    getComponent(component: typeof Component): Component {
        for(let i = 0; i < this.components.length; i+=1) {
            if(this.components[i] instanceof component) return this.components[i];
        }

        return undefined;
    }
    

    addComponent(component: typeof Component): Component {
        const comp: Component = new component(this);
        this.components.push(comp);

        return comp;
    }


}