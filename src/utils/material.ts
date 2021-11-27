import { Color } from "./color";

// Material store to map a color to a string USED IN THE .mtl files in objParser
export type MaterialStore = Map<string, Color>;