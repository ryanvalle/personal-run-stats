import React, { Component } from 'react';

const DEFAULT_H2 = 'text-3xl';

class SectionHeader extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="text-center text-black dark:text-white pt-[2em] pb-[1em] px-[20px] border-b-[1px] border-black dark:border-white border-dotted">
                <h2 className={`font-normal ${DEFAULT_H2} leading-4 pr-1 whitespace-nowrap justify-center`}>{this.props.text}</h2>
            </div>
        );
    }
}

export default SectionHeader;