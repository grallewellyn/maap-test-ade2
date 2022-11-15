import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import SelectIcon from "mdi-material-ui/SelectDrag";
import { Manager, Target, Popper } from "react-popper";
import { MapButton, ClickAwayListener, EnhancedTooltip } from "_core/components/Reusables";
import { MapToolsMenu } from "components/Map";
import MiscUtil from "_core/utils/MiscUtil";
import displayStyles from "_core/styles/display.scss";

export class MapToolsButton extends Component {
    constructor(props) {
        super(props);

        this.isOpen = false;
    }

    setOpen(open) {
        this.isOpen = open;
        this.forceUpdate();
    }

    render() {
        let btnClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <ClickAwayListener
                onClickAway={() => {
                    this.setOpen(false);
                }}
            >
                <Manager>
                    <Target>
                        <EnhancedTooltip title="Select Area" placement="right">
                            <MapButton
                                color={this.isOpen ? "primary" : "default"}
                                onClick={() => {
                                    this.setOpen(!this.isOpen);
                                }}
                                aria-label="Tools"
                                className={btnClasses}
                            >
                                <SelectIcon />
                            </MapButton>
                        </EnhancedTooltip>
                    </Target>
                    <Popper
                        placement="left-end"
                        style={{ marginRight: "5px", zIndex: "3001" }}
                        modifiers={{
                            computeStyle: {
                                gpuAcceleration: false
                            }
                        }}
                        eventsEnabled={this.isOpen}
                        className={!this.isOpen ? displayStyles.noPointer : ""}
                    >
                        <Grow style={{ transformOrigin: "right bottom" }} in={this.isOpen}>
                            <Paper>
                                <MapToolsMenu
                                    handleRequestClose={() => {
                                        this.setOpen(false);
                                    }}
                                />
                            </Paper>
                        </Grow>
                    </Popper>
                </Manager>
            </ClickAwayListener>
        );
    }
}

MapToolsButton.propTypes = {
    className: PropTypes.string
};

export default MapToolsButton;
