import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Immutable from "immutable";
import fuzzysearch from "fuzzysearch";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import MiscUtil from "utils/MiscUtil";
import appConfig from "constants/appConfig";
import { IconButtonSmall } from "_core/components/Reusables";
import * as appStringsCore from "_core/constants/appStrings";
import * as appActions from "actions/appActions";
import styles from "components/LayerMenu/LayerManager.scss";

export class LayerManager extends Component {
    constructor(props) {
        super(props);

        this.pageMax = 12;
        this.page = 0;
        this.onlyActive = false;
    }

    incPage(forward, numPages) {
        if (forward) {
            this.page += 1;
        } else {
            this.page -= 1;
        }
        this.page = Math.max(this.page, 0);
        this.page = Math.min(this.page, numPages);
        this.forceUpdate();
    }

    handleClose = () => {
        const { setLayerManagerOpen } = this.props;
        this.page = 0;

        setLayerManagerOpen(false);
    };

    handleLayerToggle = layerId => {
        this.props.setLayerSelected(layerId, !this.props.layers.getIn([layerId, "isSelected"]));
    };

    handleFilterChange = evt => {
        this.page = 0;
        this.props.setLayerFilter(evt.target.value);
    };

    clearAll = () => {
        this.props.clearAllSelected();
    };

    removeLayer = layerId => () => {
        this.props.removeLayerFromApp(layerId);
    };

    renderPaginationControls(shouldPage, numPages, totalNum) {
        if (shouldPage) {
            return (
                <div className={styles.pageCtrls}>
                    <div className={styles.pageCtrlLeft}>
                        <Typography variant="caption" className={styles.pageNum}>
                            Total: {totalNum}
                        </Typography>
                    </div>
                    <div className={styles.pageCtrlRight}>
                        <Typography variant="caption" className={styles.pageNum}>
                            <span className={styles.activePageNum}>
                                {Math.min(this.page + 1, numPages)}
                            </span>{" "}
                            / {numPages}
                        </Typography>
                        <IconButtonSmall
                            className={styles.pageLeftBtn}
                            disabled={!shouldPage || this.page === 0}
                            onClick={() => this.incPage(false, numPages - 1)}
                        >
                            <ArrowDropDownIcon />
                        </IconButtonSmall>
                        <IconButtonSmall
                            className={styles.pageRightBtn}
                            disabled={!shouldPage || this.page === numPages - 1}
                            onClick={() => this.incPage(true, numPages - 1)}
                        >
                            <ArrowDropDownIcon />
                        </IconButtonSmall>
                    </div>
                </div>
            );
        }
    }

    renderLayerList(layerList) {
        if (layerList.size > 0) {
            return (
                <List className={styles.layerList}>
                    {layerList.map(layer => {
                        const labelId = `checkbox-list-label-${layer.get("id")}`;

                        return (
                            <ListItem
                                key={layer.get("id")}
                                role={undefined}
                                dense
                                button
                                className={styles.listItem}
                                onClick={() => this.handleLayerToggle(layer.get("id"))}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={layer.get("isSelected")}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ "aria-labelledby": labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={layer.get("title")}
                                    className={styles.layerTitle}
                                />
                                <ListItemSecondaryAction className={styles.rightAction}>
                                    <IconButtonSmall
                                        edge="end"
                                        aria-label="remove"
                                        className={styles.removeLayerBtn}
                                        onClick={this.removeLayer(layer.get("id"))}
                                    >
                                        <DeleteIcon />
                                    </IconButtonSmall>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            );
        } else {
            return (
                <Typography variant="body2" className={styles.emptyLabel}>
                    None
                </Typography>
            );
        }
    }

    render() {
        const { isOpen, layers } = this.props;
        let { filter } = this.props;
        let selectedCnt = 0;
        let layerList = layers.reduce((acc, layer) => {
            if (!layer.get("isDisabled")) {
                if (layer.get("isSelected")) {
                    selectedCnt += 1;
                }
                return acc.push(layer);
            }
            return acc;
        }, Immutable.List());
        if (filter !== "") {
            filter = filter.toLowerCase();
            layerList = layerList.filter(layer => {
                return fuzzysearch(filter, layer.get("title").toLowerCase());
            });
        }
        layerList = layerList.toList().sort(MiscUtil.getImmutableObjectSort("title"));

        let totalNum = layerList.size;
        const numPages = Math.ceil(totalNum / this.pageMax);
        if (totalNum > this.pageMax) {
            layerList = layerList.slice(this.page * this.pageMax, (this.page + 1) * this.pageMax);
        }

        const containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof className !== "undefined"
        });

        return (
            <Dialog
                open={isOpen}
                onClose={this.handleClose}
                className={containerClasses}
                container={() => appConfig.RENDER_NODE}
                maxWidth="md"
                disableEnforceFocus={true}
                BackdropProps={{
                    className: styles.modalBackdrop
                }}
            >
                <DialogTitle disableTypography className={styles.title}>
                    <Typography variant="h6">Manage Layers</Typography>
                    <IconButton
                        aria-label="Close"
                        className={styles.closeButton}
                        onClick={this.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={styles.content}>
                    <div className={styles.controlsContainer}>
                        <TextField
                            label="Filter"
                            className={styles.textInputRoot}
                            value={filter}
                            onChange={this.handleFilterChange}
                            margin="none"
                            variant="outlined"
                            InputLabelProps={{
                                classes: {
                                    root: styles.inputLabelRoot
                                }
                            }}
                            InputProps={{
                                classes: {
                                    root: styles.inputWrapper,
                                    input: styles.input
                                }
                            }}
                        />
                        <div className={styles.ctrlBtnWrapper}>
                            <Button
                                color="primary"
                                className={styles.ctrlBtn}
                                onClick={this.clearAll}
                            >
                                Clear Selected ({selectedCnt})
                            </Button>
                        </div>
                    </div>
                    {this.renderLayerList(layerList)}
                </DialogContent>
                {this.renderPaginationControls(totalNum > this.pageMax, numPages, totalNum)}
            </Dialog>
        );
    }
}

LayerManager.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    setLayerManagerOpen: PropTypes.func.isRequired,
    setLayerSelected: PropTypes.func.isRequired,
    clearAllSelected: PropTypes.func.isRequired,
    setLayerFilter: PropTypes.func.isRequired,
    removeLayerFromApp: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        isOpen: state.view.getIn(["layerManager", "isOpen"]),
        filter: state.view.getIn(["layerManager", "filter"]),
        layers: state.map.getIn(["layers", appStringsCore.LAYER_GROUP_TYPE_DATA])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLayerManagerOpen: bindActionCreators(appActions.setLayerManagerOpen, dispatch),
        setLayerSelected: bindActionCreators(appActions.setLayerSelected, dispatch),
        clearAllSelected: bindActionCreators(appActions.clearAllSelected, dispatch),
        setLayerFilter: bindActionCreators(appActions.setLayerFilter, dispatch),
        removeLayerFromApp: bindActionCreators(appActions.removeLayerFromApp, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayerManager);
