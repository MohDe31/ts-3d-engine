declare interface WorldSettings {
    WIDTH: number;
    HEIGHT: number;
    ELEMENT_SIZE: number;
}

declare interface CameraProjectionSettings {
    F: number,
    ALPHA: number,
    BETA: number
}

declare interface RendererSettings {
    showfps?: boolean;
}
