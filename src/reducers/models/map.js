import appConfig from "constants/appConfig";
import { mapState as mapStateCore, layerModel as layerModelCore } from "_core/reducers/models/map";

export const mapState = mapStateCore.mergeDeep({
    areaSelections: {},
    view: {
        projection: appConfig.DEFAULT_PROJECTION.code,
        pixelClickCoordinate: {
            data: []
        }
    }
});

export const layerModel = layerModelCore.mergeDeep({
    isSelected: true
});
