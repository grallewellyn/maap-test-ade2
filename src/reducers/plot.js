import * as actionTypes from "constants/actionTypes";
import { plotState } from "reducers/models/plot";
import PlotReducer from "reducers/reducerFunctions/PlotReducer";

export default function plot(state = plotState, action, opt_reducer = PlotReducer) {
    switch (action.type) {
        case actionTypes.GENERATE_PLOT_COMMAND:
            return opt_reducer.generatePlotCommand(state, action);

        case actionTypes.SET_PLOT_COMMAND_DISPLAY:
            return opt_reducer.setPlotCommandDisplay(state, action);

        case actionTypes.SET_PLOT_COMMAND_INFO:
            return opt_reducer.setPlotCommandInfo(state, action);

        default:
            return state;
    }
}
