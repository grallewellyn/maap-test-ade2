import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { Manager, Target, Popper } from "react-popper";
import { EnhancedSwitch, ClickAwayListener, IconButtonSmall } from "_core/components/Reusables";
import * as appActions from "actions/appActions";
import * as mapActionsCore from "_core/actions/mapActions";
import * as appStrings from "constants/appStrings";
import { LayerPositionIcon, LayerOpacityIcon } from "_core/components/LayerMenu";
import { LayerPositionControl, LayerOpacityControl } from "components/LayerMenu";
import MiscUtil from "_core/utils/MiscUtil";
import { LayerControlContainer as LayerControlContainerCore } from "_core/components/LayerMenu/LayerControlContainer.js";
import styles from "components/LayerMenu/LayerControlContainer.scss";
import textStyles from "_core/styles/text.scss";
import displayStyles from "_core/styles/display.scss";

export class LayerControlContainer extends LayerControlContainerCore {
    setLayerActive(active) {
        this.isChangingPosition = false;
        this.isChangingOpacity = false;
        this.props.mapActions.setLayerActive(this.props.layer.get("id"), active);
    }

    renderTopContent() {
        const active = this.props.layer.get("isActive");
        return (
            <div className={styles.topContent}>
                <EnhancedSwitch
                    checked={active}
                    onChange={(value, checked) => this.setLayerActive(!active)}
                    onClick={evt => this.setLayerActive(!active)}
                />
                <Typography
                    variant="body2"
                    className={`${styles.layerTitle} ${textStyles.textEllipsis}`}
                >
                    {this.props.layer.get("title")}
                </Typography>
                {this.renderIconRow()}
            </div>
        );
    }

    renderIconRow() {
        const active = this.props.layer.get("isActive");
        const is3DLayer =
            this.props.layer.get("handleAs") === appStrings.LAYER_VECTOR_3D_TILES ? true : false;
        const in3DMode = this.props.in3DMode;

        let classes = MiscUtil.generateStringFromSet({
            [styles.layerControlIconRow]: true,
            [displayStyles.invisible]: !active,
            [displayStyles.hiddenFadeIn]: active
        });

        let positionPopoverClasses = MiscUtil.generateStringFromSet({
            [styles.popover]: true,
            [styles.positionPopover]: true,
            [displayStyles.noPointer]: !this.isChangingPosition
        });

        let opacityPopoverClasses = MiscUtil.generateStringFromSet({
            [styles.popover]: true,
            [displayStyles.noPointer]: !this.isChangingOpacity
        });

        if (is3DLayer && !in3DMode) {
            return (
                <div className={classes}>
                    <div className={styles.controlsMessage}>Only visible in 3D</div>
                </div>
            );
        }

        return (
            <div className={classes}>
                {!is3DLayer && (
                    <Manager style={{ display: "inline-block" }}>
                        <ClickAwayListener
                            wrap={true}
                            onClickAway={() => {
                                if (this.isChangingPosition) {
                                    this.toggleChangingPosition();
                                }
                            }}
                        >
                            <Target>
                                <LayerPositionIcon
                                    displayIndex={this.props.layer.get("displayIndex")}
                                    activeNum={this.props.activeNum}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingPosition ? "primary" : "default"}
                                    onClick={() => this.toggleChangingPosition()}
                                />
                            </Target>
                            <Popper
                                placement="left"
                                modifiers={{
                                    computeStyle: {
                                        gpuAcceleration: false
                                    }
                                }}
                                eventsEnabled={this.isChangingPosition}
                                className={positionPopoverClasses}
                            >
                                <Grow
                                    style={{ transformOrigin: "right" }}
                                    in={this.isChangingPosition}
                                >
                                    <div>
                                        <LayerPositionControl
                                            isActive={this.isChangingPosition}
                                            moveToTop={() => this.moveToTop()}
                                            moveToBottom={() => this.moveToBottom()}
                                            moveUp={() => this.moveUp()}
                                            moveDown={() => this.moveDown()}
                                        />
                                    </div>
                                </Grow>
                            </Popper>
                        </ClickAwayListener>
                        <ClickAwayListener
                            wrap={true}
                            onClickAway={() => {
                                if (this.isChangingOpacity) {
                                    this.toggleChangingOpacity();
                                }
                            }}
                        >
                            <Target>
                                <LayerOpacityIcon
                                    opacity={this.props.layer.get("opacity")}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingOpacity ? "primary" : "default"}
                                    onClick={() => this.toggleChangingOpacity()}
                                />
                            </Target>
                            <Popper
                                placement="left"
                                modifiers={{
                                    computeStyle: {
                                        gpuAcceleration: false
                                    }
                                }}
                                className={opacityPopoverClasses}
                                eventsEnabled={this.isChangingOpacity}
                            >
                                <Grow
                                    style={{ transformOrigin: "right" }}
                                    in={this.isChangingOpacity}
                                >
                                    <div>
                                        <LayerOpacityControl
                                            isActive={this.isChangingOpacity}
                                            opacity={this.props.layer.get("opacity")}
                                            onChange={value => this.changeOpacity(value)}
                                        />
                                    </div>
                                </Grow>
                            </Popper>
                        </ClickAwayListener>
                    </Manager>
                )}
                <IconButtonSmall
                    color="inherit"
                    className={styles.iconButtonSmall}
                    onClick={() => this.props.zoomToLayer(this.props.layer.get("id"))}
                >
                    <MyLocationIcon />
                </IconButtonSmall>
            </div>
        );
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.layerControl]: true,
            [styles.layerControlActive]: this.props.layer.get("isActive"),
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return <div className={containerClasses}>{this.renderTopContent()}</div>;
    }
}

LayerControlContainer.propTypes = Object.assign({}, LayerControlContainerCore.propTypes, {
    zoomToLayer: PropTypes.func.isRequired,
    in3DMode: PropTypes.bool.isRequired
});

function mapDispatchToProps(dispatch) {
    return {
        zoomToLayer: bindActionCreators(appActions.zoomToLayer, dispatch),
        mapActions: bindActionCreators(mapActionsCore, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(LayerControlContainer);
