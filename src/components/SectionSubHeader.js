import React, { Component } from 'react';

class SectionSubHeader extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="text-center text-black dark:text-white pt-[1em] pb-[0.5em] px-[20px] border-b-[1px] border-black dark:border-white border-dotted">
                <h3 className={`font-normal text-xl leading-4 pr-1 whitespace-nowrap justify-center`}>{this.props.text}</h3>
            </div>
        );
    }
}

export default SectionSubHeader;