//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
import moment from "moment";

export default class PlotReducer {
    static generatePlotCommand(state, action) {
        const commandInfo = state.get("commandInfo");
        const fullCmdTxt = [
            `# Initialize parameter variables`,
            `plotType = ${commandInfo.get("plotType")}`,
            `startDate = "${moment(commandInfo.get("startDate"))
                .utc()
                .toISOString()}"`,
            `endDate = "${moment(commandInfo.get("endDate"))
                .utc()
                .toISOString()}"`,
            `ds = [${commandInfo
                .get("datasets")
                .toList()
                .map(l => '"' + l + '"')
                .join(", ")}]`,
            `geometry = ${JSON.stringify(commandInfo.get("geometry"))}`,
            `# Retrieve the data`,
            `data = ipycmc.retrieve_data(plotType, startDate, endDate, ds, geometry)`,
            `# Plot the data`,
            `ipycmc.plot_data(plotType, data)`
        ].join("\r\n");

        const currCtr = state.get("commandGenCtr");

        return state.set("commandStr", fullCmdTxt).set("commandGenCtr", currCtr + 1);
    }

    static setPlotCommandInfo(state, action) {
        const currOps = state.get("commandInfo");
        return state
            .setIn(["commandInfo", "plotType"], action.options.plotType || currOps.get("plotType"))
            .setIn(["commandInfo", "datasets"], action.options.datasets || currOps.get("datasets"))
            .setIn(
                ["commandInfo", "startDate"],
                action.options.startDate || currOps.get("startDate")
            )
            .setIn(["commandInfo", "endDate"], action.options.endDate || currOps.get("endDate"))
            .setIn(["commandInfo", "geometry"], action.options.geometry || currOps.get("geometry"));
    }

    static setPlotCommandDisplay(state, action) {
        return state.set("display", action.display);
    }
}
