import { GroutDatasetMetadata, GroutMetadata, TileDataset } from "../types/app";
import { Dict } from "../types/utils";

// Build metadata response on start-up as it will not change while the app is running
export const buildMetadata = (
    tileDatasets: Dict<TileDataset>,
    regionMetadata: Dict<GroutDatasetMetadata>
): GroutMetadata => {
    const tileDatasetMetadata = {};
    for (const datasetName of Object.keys(tileDatasets)) {
        tileDatasetMetadata[datasetName] = {
            levels: Object.keys(tileDatasets[datasetName])
        };
    }
    return {
        datasets: {
            tile: tileDatasetMetadata,
            regionMetadata: regionMetadata
        }
    };
};
