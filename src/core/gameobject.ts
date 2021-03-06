import { Transform } from "./transform";
import { Component } from "./component";
import { Vec3, vec3Set } from "../utils/vecUtils";


export default class GameObject {
    private components: Array<Component>;
    public transform: Transform;

    constructor();
    constructor(position: Vec3, rotation: Vec3);
    constructor(position?: Vec3, rotation?: Vec3)
    {
        this.components = new Array<Component>();

        this.transform = this.addComponent(Transform) as Transform;
    
        vec3Set(this.transform.position, position || {x: 0, y: 0, z: 0});
        vec3Set(this.transform.rotation, rotation || {x: 0, y: 0, z: 0});
    }

    update(){
        // TODO: Change this to a for loop
        this.components.forEach(comp => { comp.update(); });
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