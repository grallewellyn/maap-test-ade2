import * as actionTypes from "constants/actionTypes";
import { viewState } from "reducers/models/view";
import viewCore from "_core/reducers/view";
import ViewReducer from "reducers/reducerFunctions/ViewReducer";

export default function view(state = viewState, action, opt_reducer = ViewReducer) {
    switch (action.type) {
        case actionTypes.SET_LAYER_MANAGER_OPEN:
            return opt_reducer.setLayerManagerOpen(state, action);

        case actionTypes.SET_LAYER_FILTER:
            return opt_reducer.setLayerFilter(state, action);

        default:
            return viewCore.call(this, state, action, opt_reducer);
    }
}
