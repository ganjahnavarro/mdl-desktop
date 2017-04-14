import React from 'react'
import Dropdown from './dropdown'

class Datatable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let self = this;
        $(document).keydown(function(event){
            if (event.keyCode == 37) {
                console.log("left");

                let { selectedColumnIndex } = self.state;
                selectedColumnIndex = Math.max(0, selectedColumnIndex - 1);
                self.setState({selectedColumnIndex});

                return false;
            }

            if (event.keyCode == 38) {
                console.log("up");

                let { selectedRowIndex } = self.state;
                selectedRowIndex = Math.max(0, selectedRowIndex - 1);
                self.setState({selectedRowIndex});

                return false;
            }

            if (event.keyCode == 39) {
                console.log("right");

                let { selectedColumnIndex } = self.state;
                selectedColumnIndex = Math.min(self.props.columns.length, selectedColumnIndex + 1);
                self.setState({selectedColumnIndex});

                return false;
            }

            if (event.keyCode == 40) {
                console.log("down");

                let { selectedRowIndex, stateRows } = self.state;
                let rows = self.props.rows || [];
                selectedRowIndex = Math.min(rows.length, selectedRowIndex + 1);
                self.setState({selectedRowIndex});

                return false;
            }
        });
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
        let rows = this.state.rows || this.props.rows;
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
        let rows = this.state.rows || this.props.rows;
        rows[rowIndex][columnKey] = event.target.value;
        this.setState({rows});
    }

    onTestChange(rowIndex, agent) {
        let rows = this.state.rows || this.props.rows;
        rows[rowIndex].agent.id = agent.value;
        this.setState({rows});
		}

    renderCell(column, columnIndex, row, rowIndex) {
        let { selectedRowIndex, selectedColumnIndex } = this.state;
        let selected = columnIndex == selectedColumnIndex && rowIndex == selectedRowIndex;

        let onCellClick = () => {
            console.log("on focus!", selected);
            if (!selected) {

                this.setState({
                    selectedColumnIndex: columnIndex,
                    selectedRowIndex: rowIndex
                });
            }
        };

        let cellClassName = selected ? "selected" : null;
        let cellContent = column.test ? "" : row[column.key];

        let tabIndex = this.tabIndex++;

        if (selected && !this.props.disabled && column.editable) {
            cellClassName += " editing";
            this.onCellFocus = true;

            let inputBasic = <input value={row[column.key]}
                onChange={(event) => this.onCellEdit(column.key, rowIndex, event)}
                ref={(input) => {this.selectedInput = input;}}
                tabIndex={tabIndex} />;

            let inputDropdown = <Dropdown value={row.agent.id}
								options={this.props.testList}
                onChange={(agent) => this.onTestChange(rowIndex, agent)} />

            console.log(row.agent);
            console.log(this.props.testList); 

            cellContent = column.test ? inputDropdown : inputBasic;
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
