import React, { Component } from 'react';

const DEFAULT_H2 = 'text-lg lg:text-3xl';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="flex w-screen text-left drop-shadow-md dark:text-black py-[5px] px-[20px]">
                <h2 className={`font-normal ${DEFAULT_H2} leading-4 pr-1 whitespace-nowrap drop-shadow-md shadow-white`}>{this.props.data.data}</h2>
                <div className="border-b border-black border-dotted w-full"></div>
            </div>
        );
    }
}

export default Header;