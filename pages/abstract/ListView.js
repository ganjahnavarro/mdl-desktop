import React from 'react'
import View from './View'

class ListView extends View {

    constructor(props) {
        super(props);
    }

    firstItem() {
				this.onItemClick(0);
		}

		nextItem() {
				let { items, selectedIndex } = this.state;
				if (items.length - 1 > selectedIndex) {
						this.onItemClick(selectedIndex + 1);
				}
		}

		previousItem() {
				let { selectedIndex } = this.state;
				if (selectedIndex > 0) {
						this.onItemClick(selectedIndex - 1);
				}
		}

		lastItem() {
				this.onItemClick(this.state.items.length - 1);
		}

    onItemClick(index) {
        let item = this.state.items[index];

				this.setState({
						selectedItem: item,
						selectedIndex: index
				});
		}

}

export default ListView;
