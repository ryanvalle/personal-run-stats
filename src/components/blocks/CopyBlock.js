import React, { Component } from 'react';

class CopyBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let text = (this.props.data || {}).text;
        let padding = text.primary ? 'pt-[20px] pb-[10px] px-[10px] lg:pt-[20px] lg:pb-[20px] lg:px-[20px]' : 'px-[20px] py-[10px] lg:py-[20px]'
        return(
            <div className={`block w-full text-center ${padding}`}>
                {text.primary && <h2 className="text-2xl lg:text-3xl font-semibold">{text.primary}</h2>}
                {text.secondary && <p className="text-lg lg:text-xl font-light">{text.secondary}</p>}
            </div>
        );
    }
}

export default CopyBlock;