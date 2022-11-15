import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Immutable from "immutable";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { DatePicker } from "components/DatePicker";
import MiscUtil from "utils/MiscUtil";
import appConfig from "constants/appConfig";
import * as appActions from "actions/appActions";
import * as appStringsCore from "_core/constants/appStrings";
import styles from "components/Plot/PlotCommandDisplay.scss";

export class PlotCommandDisplay extends Component {
    closeModal = () => {
        this.props.setPlotCommandDisplay(false);
    };

    generatePlotCommand = () => {
        this.props.generatePlotCommand();
    };

    copyRetrieve = () => {
        if (this.retrieveCmdText) {
            this.retrieveCmdText.focus();
            this.retrieveCmdText.select();

            document.execCommand("copy");
            this.retrieveCmdText.blur();
        }
    };

    copyPlot = () => {
        if (this.plotCmdText) {
            this.plotCmdText.focus();
            this.plotCmdText.select();

            document.execCommand("copy");
            this.plotCmdText.blur();
        }
    };

    handlePlotTypeChange = event => {
        this.props.setPlotCommandInfo({ plotType: event.target.value });
    };

    handleStartDateChange = date => {
        this.props.setPlotCommandInfo({ startDate: moment.utc(date).toDate() });
    };

    handleEndDateChange = date => {
        this.props.setPlotCommandInfo({ endDate: moment.utc(date).toDate() });
    };

    handleLayerChange = event => {
        const ids = event.target.value;
        const selected = ids.reduce((acc, id) => {
            if (acc.includes(id)) {
                // duplicate --> remove
                return acc.delete(id);
            }
            return acc.add(id);
        }, Immutable.Set());

        this.props.setPlotCommandInfo({ datasets: selected });
    };

    renderSelectedDatasets = selected => {
        const { layers } = this.props;

        if (selected.length > 1) {
            return `${selected.length} selected`;
        } else {
            return selected.map(l => layers.getIn([l, "title"])).join(", ");
        }
    };

    render() {
        const { display, commandInfo, className, layers } = this.props;
        const containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof className !== "undefined"
        });

        const selectedLayers = commandInfo.get("datasets");

        return (
            <Dialog
                onClose={this.closeModal}
                open={display}
                container={() => appConfig.RENDER_NODE}
                maxWidth="md"
                className={containerClasses}
                disableEnforceFocus={true}
                BackdropProps={{
                    className: styles.modalBackdrop
                }}
            >
                <DialogTitle disableTypography className={styles.title}>
                    <Typography variant="h6">Notebook Plot Commands</Typography>
                    <IconButton
                        aria-label="Close"
                        className={styles.closeButton}
                        onClick={this.closeModal}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={styles.content}>
                    <Typography gutterBottom>
                        Use the controls below to generate and run a plot command for the notebook.
                    </Typography>
                    <div className={styles.optionsRow}>
                        <FormControl className={styles.formControl}>
                            <InputLabel htmlFor="plot-type">Plot Type</InputLabel>
                            <Select
                                value={commandInfo.get("plotType")}
                                onChange={this.handlePlotTypeChange}
                                className={styles.formInputWrapper}
                                MenuProps={{
                                    container: () => appConfig.RENDER_NODE,
                                    classes: { paper: styles.menuWrapper }
                                }}
                                input={<Input id="plot-type" name="plot" />}
                                inputProps={{
                                    className: styles.formInput
                                }}
                            >
                                {appConfig.PLOT_TYPES.map(x => (
                                    <MenuItem key={`plot_${x.value}`} value={x.value}>
                                        {x.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={styles.formControl}>
                            <InputLabel htmlFor="ds-select">Datasets</InputLabel>
                            <Select
                                multiple
                                value={selectedLayers.toList().toJS()}
                                onChange={this.handleLayerChange}
                                className={styles.formInputWrapper}
                                MenuProps={{
                                    container: () => appConfig.RENDER_NODE,
                                    classes: { paper: styles.menuWrapper }
                                }}
                                inputProps={{
                                    className: styles.formInput
                                }}
                                input={<Input id="ds-select" name="ds-select" />}
                                renderValue={this.renderSelectedDatasets}
                            >
                                {layers.toList().map(l => (
                                    <MenuItem key={`layer_op_${l.get("id")}`} value={l.get("id")}>
                                        <Checkbox checked={selectedLayers.includes(l.get("id"))} />
                                        <ListItemText
                                            primary={l.get("title")}
                                            classes={{ primary: styles.menuItemText }}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.optionsRow}>
                        <FormControl className={styles.datePickerWrapper}>
                            <InputLabel>Start Date</InputLabel>
                            <DatePicker
                                date={commandInfo.get("startDate")}
                                setDate={this.handleStartDateChange}
                                className={styles.datePicker}
                            />
                        </FormControl>
                        <FormControl className={styles.datePickerWrapper}>
                            <InputLabel>End Date</InputLabel>
                            <DatePicker
                                date={commandInfo.get("endDate")}
                                setDate={this.handleEndDateChange}
                                className={styles.datePicker}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.buttonRow}>
                        <Button onClick={this.generatePlotCommand} color="primary" size="small">
                            Generate Command
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

PlotCommandDisplay.propTypes = {
    display: PropTypes.bool.isRequired,
    commandStr: PropTypes.string.isRequired,
    commandInfo: PropTypes.object.isRequired,
    layers: PropTypes.object.isRequired,
    setPlotCommandDisplay: PropTypes.func.isRequired,
    setPlotCommandInfo: PropTypes.func.isRequired,
    generatePlotCommand: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        commandStr: state.plot.get("commandStr"),
        commandInfo: state.plot.get("commandInfo"),
        display: state.plot.get("display"),
        layers: state.map
            .getIn(["layers", appStringsCore.LAYER_GROUP_TYPE_DATA])
            .filter(l => l.get("isActive"))
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPlotCommandInfo: bindActionCreators(appActions.setPlotCommandInfo, dispatch),
        generatePlotCommand: bindActionCreators(appActions.generatePlotCommand, dispatch),
        setPlotCommandDisplay: bindActionCreators(appActions.setPlotCommandDisplay, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlotCommandDisplay);
