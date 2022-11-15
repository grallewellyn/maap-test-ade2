import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Input from "@material-ui/core/Input";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "components/DatePicker/DatePicker.scss";

export class DatePicker extends Component {
    componentDidMount() {
        this.dateStr = moment.utc(this.props.date).format("YYYY MMM DD, HH:mm UTC");
        this.error = false;
        this.submitUpdate = false;
        this.updateFromInternal = false;
    }

    shouldComponentUpdate(nextProps) {
        let wasSubmitUpdate = this.submitUpdate;
        this.submitUpdate = false;
        let date = moment.utc(this.dateStr, "YYYY MMM DD, HH:mm UTC").toDate();
        if (wasSubmitUpdate && nextProps.date - date !== 0) {
            this.error = true;
        } else {
            this.error = false;
        }
        return wasSubmitUpdate || nextProps.date !== this.props.date || nextProps.date !== date;
    }

    handleKeyPress(evt) {
        if (evt.charCode === 13) {
            // enter key
            let date = moment.utc(this.dateStr, "YYYY MMM DD, HH:mm UTC");
            if (date.isValid()) {
                this.submitDate(date.toDate());
            } else {
                this.submitDate(this.props.date);
            }
        }
    }

    handleBlur(evt) {
        let date = moment.utc(this.dateStr, "YYYY MMM DD, HH:mm UTC");
        if (date.isValid()) {
            this.submitDate(date.toDate());
        } else {
            this.submitDate(this.props.date);
        }
    }

    handleChange(dateStr) {
        this.dateStr = dateStr;
        this.error = false;
        this.updateFromInternal = true;
        this.forceUpdate();
    }

    submitDate(date) {
        this.submitUpdate = true;
        this.props.setDate(date);
    }

    render() {
        let dateStr = this.dateStr;

        if (!this.updateFromInternal) {
            dateStr = moment.utc(this.props.date).format("YYYY MMM DD, HH:mm UTC");
        }
        this.updateFromInternal = false;
        this.dateStr = dateStr;

        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClasses}>
                <Input
                    value={dateStr}
                    onBlur={evt => {
                        this.handleBlur(evt.target.value);
                    }}
                    inputProps={{
                        "aria-label": "date",
                        onKeyPress: evt => {
                            this.handleKeyPress(evt);
                        }
                    }}
                    classes={{ root: styles.inputWrapper, input: styles.input }}
                    fullWidth={true}
                    margin="dense"
                    onChange={evt => this.handleChange(evt.target.value)}
                />
            </div>
        );
    }
}

DatePicker.propTypes = {
    setDate: PropTypes.func.isRequired,
    date: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default DatePicker;
