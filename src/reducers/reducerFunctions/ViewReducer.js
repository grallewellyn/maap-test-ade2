import ViewReducerCore from "_core/reducers/reducerFunctions/ViewReducer";
import MiscUtil from "utils/MiscUtil";

export default class ViewReducer extends ViewReducerCore {
    static miscUtil = MiscUtil;

    static setLayerManagerOpen(state, action) {
        return state.setIn(["layerManager", "isOpen"], action.isOpen);
    }

    static setLayerFilter(state, action) {
        return state.setIn(["layerManager", "filter"], action.filter || "");
    }
}
