import Immutable from "immutable";
import moment from "moment";

export const plotState = Immutable.fromJS({
    commandInfo: {
        plotType: "timeseries",
        datasets: Immutable.Set(),
        startDate: new Date(),
        endDate: new Date(),
        geometry: {}
    },
    commandStr: "",
    commandGenCtr: -1,
    display: false,
    alerts: []
});
