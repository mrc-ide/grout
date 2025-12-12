import { Dict } from "./utils";
import { TileDatabase } from "../db/tileDatabase";

export interface GroutConfig {
    port: number;
}
// A dataset consists of several tile databases, one at each level.
// We represent this as a dict, where the keys are the level names
export type TileDataset = Dict<TileDatabase>;

export type GroutDatasetMetadata = {
    levels: string[];
};

export type DatasetTypes = "tile" | "region-metadata";

// Data type of metadata response - currently provides only the dataset names and levels for tile data, but will
// eventually include other types of metadata
export interface GroutMetadata {
    datasets: Record<DatasetTypes, Dict<GroutDatasetMetadata>>;
}

export interface AppLocals {
    tileDatasets: Dict<TileDataset>;
}
