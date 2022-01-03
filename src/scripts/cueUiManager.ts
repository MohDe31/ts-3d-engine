import { Component } from "../core/component";

export class CueUiManager extends Component {

    private powerElement: HTMLElement;

    start(){
        this.powerElement = document.getElementById("power");
    }

    update(){
        if(!this.powerElement) this.start();
    }

    public setPower(value: number){
        this.powerElement.style.width = `${value}%`;
    }
}