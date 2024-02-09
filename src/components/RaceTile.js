import React, { Component } from 'react';

const DEFAULT_H2 = 'text-xl md:text-2xl lg:text-3xl';
const DEFAULT_H2_SM = 'text-lg md:text-xl';

class RaceTile extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className={this.props.idx === 0 ? 'w-[100%]' : 'w-[50%]'}>
                <div className="p-3 md:p-4 border-white border-[1px] rounded-lg md:rounded-xl mx-2 my-1">
                
                    {this.props.idx === 0 && <h2 className={` font-normal ${DEFAULT_H2}`}>{this.props.data.name}</h2>}
                    {this.props.idx > 0 && <h2 className={`font-normal ${DEFAULT_H2_SM}`}>{this.props.data.name}</h2>}
                </div>
                
            </div>

        );
    }
}

export default RaceTile;