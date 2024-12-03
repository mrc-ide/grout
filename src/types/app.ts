import {Dict} from "./utils";
import {TileDatabase} from "../db/tileDatabase";

export interface GroutConfig {
    port: number;
}
// A dataset consists of several tile databases, one at each level.
// We represent this as a dict, where the keys are the level names
export type TileDataset = Dict<TileDatabase>

export interface AppLocals {
    tileDatasets: Dict<TileDataset>
}