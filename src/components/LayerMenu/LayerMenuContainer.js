/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import * as appActions from "actions/appActions";
import { LayerControlContainer } from "components/LayerMenu";
import { EnhancedSwitch, IconButtonSmall } from "_core/components/Reusables";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "components/LayerMenu/LayerMenuContainer.scss";

export class LayerMenuContainer extends Component {
    constructor(props) {
        super(props);

        this.pageMax = 9;
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

    setOnlyActive(active) {
        this.onlyActive = active;
        this.page = 0;
        this.forceUpdate();
    }

    openManager = () => {
        this.props.setLayerManagerOpen(true);
    };

    renderPaginationControls(shouldPage, numPages, numActive) {
        if (shouldPage) {
            return (
                <div className={styles.pageCtrls}>
                    <div className={styles.pageCtrlLeft}>
                        <FormControlLabel
                            className={styles.activeToggle}
                            classes={{
                                label: styles.activeToggleLabel
                            }}
                            control={
                                <EnhancedSwitch
                                    checked={this.onlyActive}
                                    onChange={() => this.setOnlyActive(!this.onlyActive)}
                                    disabled={numActive === 0 && !this.onlyActive}
                                />
                            }
                            label="Only Active Layers"
                        />
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

    render() {
        let layerList = this.props.layers
            .filter(layer => !layer.get("isDisabled") && layer.get("isSelected"))
            .toList()
            .sort(MiscUtil.getImmutableObjectSort("title"));
        let totalNum = layerList.size;

        if (this.onlyActive) {
            layerList = layerList.filter(layer => layer.get("isActive"));
        }
        let displayNum = layerList.size;

        let activeNum = layerList.count(el => {
            return el.get("isActive");
        });

        // calculate som pagination
        // const shouldPage = displayNum > this.pageMax;
        const numPages = Math.ceil(displayNum / this.pageMax);
        if (displayNum > this.pageMax) {
            layerList = layerList.slice(this.page * this.pageMax, (this.page + 1) * this.pageMax);
        }

        // css classes
        let layerMenuClasses = MiscUtil.generateStringFromSet({
            [styles.layerMenu]: true,
            [styles.open]: this.props.layerMenuOpen,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        let collapseIconClasses = MiscUtil.generateStringFromSet({
            [styles.collapseBtn]: true,
            [styles.expand]: !this.props.layerMenuOpen,
            [styles.collapse]: this.props.layerMenuOpen
        });

        let manageBtnClasses = MiscUtil.generateStringFromSet({
            [styles.manageBtn]: true,
            [styles.manageBtnHidden]: !this.props.layerMenuOpen
        });

        const in3DMode = this.props.in3DMode;

        const content =
            displayNum > 0 ? (
                layerList.map((layer, i) => (
                    <React.Fragment key={layer.get("id") + in3DMode + "_layer_listing"}>
                        <LayerControlContainer
                            layer={layer}
                            activeNum={activeNum}
                            in3DMode={in3DMode}
                        />
                        {i < layerList.size - 1 ? <Divider /> : undefined}
                    </React.Fragment>
                ))
            ) : (
                <Typography variant="body2" className={styles.emptyLabel}>
                    None
                </Typography>
            );

        return (
            <Paper elevation={1} className={layerMenuClasses}>
                <div className={`${styles.layerHeaderRow} ${styles.layerHeaderRow}`}>
                    <div className={`${styles.layerHeader} ${styles.layerHeader}`}>
                        <Typography variant="body2" color="inherit">
                            Map Layers ({totalNum})
                        </Typography>
                    </div>
                    <div className={styles.headerRight}>
                        <Button
                            className={manageBtnClasses}
                            color="primary"
                            onClick={this.openManager}
                        >
                            Manage
                        </Button>
                        <IconButtonSmall
                            className={collapseIconClasses}
                            color="default"
                            onClick={() => this.props.setLayerMenuOpen(!this.props.layerMenuOpen)}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButtonSmall>
                    </div>
                </div>
                <Collapse in={this.props.layerMenuOpen} timeout="auto">
                    <div className={styles.layerMenuContent}>{content}</div>
                    {this.renderPaginationControls(totalNum > this.pageMax, numPages, activeNum)}
                </Collapse>
            </Paper>
        );
    }
}

LayerMenuContainer.propTypes = {
    setLayerMenuOpen: PropTypes.func.isRequired,
    layerMenuOpen: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    className: PropTypes.string,
    setLayerManagerOpen: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        layerMenuOpen: state.view.get("layerMenuOpen"),
        layers: state.map.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]),
        in3DMode: state.map.getIn(["view", "in3DMode"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLayerMenuOpen: bindActionCreators(mapActions.setLayerMenuOpen, dispatch),
        setLayerManagerOpen: bindActionCreators(appActions.setLayerManagerOpen, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayerMenuContainer);
