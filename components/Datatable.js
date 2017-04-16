import _ from 'lodash'
import React from 'react'
import Dropdown from './dropdown'

class Datatable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows
        };
    }

    componentDidMount() {
        $(document).keydown((event) => {
            if ([37, 38, 39, 40].includes(event.keyCode)) {
                if (event.keyCode == 37) this.onKeyLeft();
                if (event.keyCode == 38) this.onKeyUp();
                if (event.keyCode == 39) this.onKeyRight();
                if (event.keyCode == 40) this.onKeyDown();
                return false;
            }
        });
    }

    onKeyLeft() {
        let { selectedColumnIndex } = this.state;
        selectedColumnIndex = Math.max(0, selectedColumnIndex - 1);
        this.setState({selectedColumnIndex});
    }

    onKeyUp() {
        let { selectedRowIndex } = this.state;
        selectedRowIndex = Math.max(0, selectedRowIndex - 1);
        this.setState({selectedRowIndex});
    }

    onKeyRight() {
        let { selectedColumnIndex } = this.state;
        selectedColumnIndex = Math.min(this.props.columns.length, selectedColumnIndex + 1);
        this.setState({selectedColumnIndex});
    }

    onKeyDown() {
        let { selectedRowIndex, stateRows } = this.state;
        let rows = this.state.rows || [];
        selectedRowIndex = Math.min(rows.length, selectedRowIndex + 1);
        this.setState({selectedRowIndex});
    }

    componentDidUpdate() {
        if (this.selectedInput && this.onCellFocus) {
            this.selectedInput.focus();
            this.selectedInput.setSelectionRange(0, this.selectedInput.value.length);
            this.onCellFocus = false;
        }
    }

    getHeaders() {
        this.tabIndex = 1;

        let columns = this.props.columns.map((column) => <th key={column.key}>{column.name}</th>);
        return <thead>
            <tr>{columns}</tr>
        </thead>;
    }

    getBody() {
        let rows = this.state.rows;
        let rowComponents = [];

        if (rows) {
            rowComponents = rows.map((row, rowIndex) => this.getRow(row, rowIndex));
        }
        return <tbody>{rowComponents}</tbody>;
    }

    getRow(row, rowIndex) {
        let { selectedRowIndex } = this.state;
        let cells = this.props.columns.map((column, columnIndex) => {
            return this.renderCell(column, columnIndex, row, rowIndex);
        });

        let rowClassName = rowIndex == selectedRowIndex ? "selected" : null;
        return <tr key={rowIndex} className={rowClassName}>
            {cells}
        </tr>;
    }

    onCellEdit(columnKey, rowIndex, event) {
        let rows = this.state.rows;
        _.set(rows[rowIndex], columnKey, event.target.value);
        this.setState({rows});
    }

    onDropdownSelect(columnKey, rowIndex, selected) {
        /* Should not be defined here */
        let items = [{
            id: 110,
            name: 'Gan',
            description: 'Ganj description',
            unit: 'm'
        }, {
            id: 220,
            name: 'Aubs',
            description: 'Aubs description',
            unit: 'km'
        }, {
            id: 330,
            name: 'Dex',
            description: 'Xc description',
            unit: 'cm'
        }];

        let item = items.find((item) => item.id == selected.value);

        let rows = this.state.rows;
        _.set(rows[rowIndex], columnKey, item);
        this.setState({rows});

        // let rows = this.state.rows;
        // _.set(rows[rowIndex], columnKey + ".id", selected.value);
        // this.setState({rows});
		}

    renderCell(column, columnIndex, row, rowIndex) {
        let { selectedRowIndex, selectedColumnIndex } = this.state;
        let selected = columnIndex == selectedColumnIndex && rowIndex == selectedRowIndex;

        let onCellClick = () => {
            if (!selected) {
                this.onCellFocus = true;

                this.setState({
                    selectedColumnIndex: columnIndex,
                    selectedRowIndex: rowIndex
                });
            }
        };

        let cellClassName = selected ? "selected" : null;
        let cellContent = typeof column.getOptions == "undefined" ? _.get(row, column.key) : _.get(row, column.key).name;

        let tabIndex = this.tabIndex++;

        if (selected && !this.props.disabled && column.editable) {
            cellClassName += " editing";

            let inputBasic = <input value={cellContent}
                onChange={(event) => this.onCellEdit(column.key, rowIndex, event)}
                ref={(input) => {this.selectedInput = input}}
                tabIndex={tabIndex} />;

            let inputDropdown = <Dropdown value={_.get(row, column.key).id} loadOptions={column.getOptions}
                onChange={(selected) => this.onDropdownSelect(column.key, rowIndex, selected)} />

            cellContent = typeof column.getOptions == "undefined" ? inputBasic : inputDropdown;
        }

        let props = {
            key: column.key,
            tabIndex: column.editable ? tabIndex : null,
            className: cellClassName,
            onClick: onCellClick,
            onFocus: onCellClick
        }

        return <td {...props}>
            {cellContent}
        </td>;
    }

    render() {
        return <table className="table table-bordered">
            {this.getHeaders()}
            {this.getBody()}
        </table>;
    }

}

export default Datatable;
