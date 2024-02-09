import React, { Component } from 'react';

const DEFAULT_H2 = 'text-xl md:text-2xl lg:text-3xl';
const DEFAULT_H2_SM = 'text-lg md:text-xl';

class RaceTile extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data || {};
        let today = new Date();
        let raceDate = new Date(data.date);
        let dateDiff = Math.ceil((raceDate - today) / 1000 / 60 / 60 / 24);

        return(
            <div className={this.props.idx === 0 ? 'col-span-full' : ''}>
                <div className="p-3 md:p-4 border-white border-[1px] rounded-lg md:rounded-xl h-[100%]">
                    {this.props.idx === 0 && <h2 className={` font-normal ${DEFAULT_H2}`}>{data.name}</h2>}
                    {this.props.idx > 0 && <h2 className={`font-normal ${DEFAULT_H2_SM}`}>{data.name}</h2>}
                    <p className='font-light italic text-md'>
                        {data.location && <span>{data.location.city}, {data.location.state}</span>}
                        {data.date && <span> • {raceDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit', 
                            year: 'numeric'
                        })}</span>}
                        {dateDiff === 1 && <span> • Event Tomorrow!</span>}
                        {dateDiff > 1 && <span> • {dateDiff} Days Until Event!</span>}
                    </p>
                </div>
                
            </div>

        );
    }
}

export default RaceTile;