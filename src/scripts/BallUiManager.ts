import { Component } from "../core/component";

export class BallUiManager extends Component {

    private ballContainer: HTMLElement;

    start(){
        this.ballContainer = document.getElementById("right-ui");
    }

    update(){
        if(!this.ballContainer) this.start();
    }

    public setPot(){
        this.ballContainer.innerHTML += '<div class="ball"></div>';
    }
}