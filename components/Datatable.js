import _ from 'lodash'
import React from 'react'

import Provider from '../core/provider'

import Input from './input'
import Dropdown from './dropdown'

class Datatable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            newRowAdded: false
        };

        this.editableColumnIndexes = [];
        this.props.columns.forEach((col, index) => {
            if (col.editable) {
                this.editableColumnIndexes.push(index);
            }
        });
    }

    componentWillReceiveProps() {
        let nextState = this.state;
        nextState.rows = this.props.rows;
        this.setState(nextState);
    }

    componentDidMount() {
        $(document).keydown((event) => {
            if ([37, 38, 39, 40].includes(event.keyCode)) {
                this.onCellFocus = true;
                if (event.keyCode == 37) this.onKeyLeft();
                if (event.keyCode == 38) this.onKeyUp();
                if (event.keyCode == 39) this.onKeyRight();
                if (event.keyCode == 40) this.onKeyDown();
                return false;
            }
        });
    }

    onKeyDown() {
        let { selectedColumnIndex, selectedRowIndex } = this.state;
        let rows = this.state.rows || [];
        selectedRowIndex = Math.min(rows.length, selectedRowIndex + 1);
        this.setState({selectedRowIndex});
    }

    onKeyUp() {
        let { selectedColumnIndex, selectedRowIndex } = this.state;
        selectedRowIndex = Math.max(0, selectedRowIndex - 1);
        this.setState({selectedRowIndex});
    }

    onKeyLeft() {
        let continueSearch = true;
        let { selectedColumnIndex, selectedRowIndex } = this.state;
        let previousSelectedColumnIndex = selectedColumnIndex;

        do {
            if (this.isFirstColumn(selectedColumnIndex)) {
                if (this.isFirstRow(selectedRowIndex)) {
                    continueSearch = false;
                    selectedColumnIndex = previousSelectedColumnIndex;
                } else {
                    selectedRowIndex--;
                    selectedColumnIndex = this.props.columns.length;
                }
            } else {
                selectedColumnIndex--;
            }

            if (this.isColumnEditable(selectedColumnIndex)) {
                continueSearch = false;
            }
        }
        while (continueSearch);

        this.setState({selectedColumnIndex, selectedRowIndex});
    }

    onKeyRight() {
        let continueSearch = true;
        let { selectedColumnIndex, selectedRowIndex, newRowAdded, rows } = this.state;
        let previousSelectedColumnIndex = selectedColumnIndex;

        do {
            if (this.isLastColumn(selectedColumnIndex)) {
                if (this.isLastRow(selectedRowIndex)) {
                    if (newRowAdded) {
                        continueSearch = false;
                        selectedColumnIndex = previousSelectedColumnIndex;
                    } else {
                        this.addRow();
                        selectedRowIndex++;
                        selectedColumnIndex = 0;
                    }
                } else {
                    selectedRowIndex++;
                    selectedColumnIndex = 0;
                }
            } else {
                selectedColumnIndex++;
            }

            if (this.isColumnEditable(selectedColumnIndex)) {
                continueSearch = false;
            }
        }
        while (continueSearch);

        this.setState({selectedColumnIndex, selectedRowIndex});
    }

    isFirstColumn(columnIndex) {
        return columnIndex == 0;
    }

    isLastColumn(columnIndex) {
        return this.props.columns.length == columnIndex + 1;
    }

    isFirstRow(rowIndex) {
        return rowIndex == 0;
    }

    isLastRow(rowIndex) {
        let { rows } = this.state;
        return rows.length == rowIndex + 1;
    }

    isColumnEditable(columnIndex) {
        return this.editableColumnIndexes.includes(columnIndex);
    }

    addRow() {
        let rows = this.state.rows;
        rows.push({});
        this.setState({rows, newRowAdded: true});
    }

    componentDidUpdate() {
        if (this.selectedInput && this.onCellFocus) {
            this.selectedInput.focus();
            this.onCellFocus = false;

            if (this.selectedInput && this.selectedInput.value) {
                this.selectedInput.setSelectionRange(0, this.selectedInput.value.length);
            }
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

        this.onCellFocus = false;
    }

    onDropdownSelect(columnIndex, columnKey, rowIndex, selected) {
        let items = Provider.filteredItems[columnKey];
        let item = items.find((item) => item.id == selected.value);

        let rows = this.state.rows;
        _.set(rows[rowIndex], columnKey, item);
        this.setState({rows});

        this.onCellFocus = false;
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

        let value = column.formula ? column.formula(row) : this.getProperty(row, column.key);
        let cellContent = typeof column.getOptions != "undefined" && value ? value.name : value;

        if (column.editable) { this.tabIndex++ }
        let tabIndex = this.tabIndex;

        if (selected && !this.props.disabled && column.editable) {
            cellClassName += " editing";

            let inputBasic = <Input value={cellContent}
                onChange={(event) => this.onCellEdit(column.key, rowIndex, event)}
                ref={(input) => {this.selectedInput = input}}
                tabIndex={tabIndex} />;

            let onInputKeyDown = (event) => {
                if (event.keyCode == 9) {
                    event.preventDefault();
                    event.shiftKey ? this.onKeyLeft() : this.onKeyRight();
                }
            }

            let inputDropdown = <Dropdown value={value ? value.id : null} loadOptions={column.getOptions}
                onChange={(selected) => this.onDropdownSelect(columnIndex, column.key, rowIndex, selected)}
                autofocus={true} onInputKeyDown={onInputKeyDown} />

            cellContent = typeof column.getOptions == "undefined" ? inputBasic : inputDropdown;
        }

        let props = {
            key: column.key,
            tabIndex: !selected && column.editable ? tabIndex : null,
            className: cellClassName,
            onClick: onCellClick,
            onFocus: onCellClick
        }

        return <td {...props}>
            {cellContent}
        </td>;
    }

    getFooters() {
        if (this.props.footers && this.state.rows) {
          let items = this.props.footers.map((item, index) => {
              let content = item.formula ? item.formula(this.state.rows) : item.value;
              return <td key={index} colSpan={item.colSpan}>{content}</td>
          })

          return <tfoot>
                <tr>
                    {items}
                </tr>
            </tfoot>;
        }
        return null;
    }

    getProperty(object, key) {
        return _.get(object, key);
    }

    render() {
        return <table className="table table-bordered">
            {this.getHeaders()}
            {this.getBody()}
            {this.getFooters()}
        </table>;
    }

}

export default Datatable;
