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

declare interface DebugContent {
    type: "VEC3",
    message?: string,
    object: any
}