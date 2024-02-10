import React, { Component } from 'react';
import { Orbitron } from 'next/font/google';
// import { Kalam } from 'next/font/google';

const DEFAULT_H2 = 'text-xl md:text-2xl lg:text-3xl';
const DEFAULT_H2_SM = 'text-lg md:text-xl';

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['800']
  })

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
                <div className="px-3 md:px-4 pt-2 md:pt-2 border-black dark:border-white border-[1px] rounded-lg md:rounded-xl h-[100%]">
                    {this.props.idx === 0 && <h2 className={` font-normal ${DEFAULT_H2} pb-2`}>{data.name}</h2>}
                    {this.props.idx > 0 && <h2 className={`font-normal ${DEFAULT_H2_SM} pb-2`}>{data.name}</h2>}
                    <div className="text-center text-lg grid grid-cols-2 gap-2 auto-rows-fr">
                        <div className='grid gap-0 border-[1px] border-dotted border-black dark:border-white p-2'>
                            <span className='font-light uppercase text-sm leading-[0.75rem]'>Days Until Event:</span>
                            <span className={`text-3xl ${orbitron.className} text-center p-0 leading-[1.5rem]`}>{dateDiff}</span>
                        </div>
                        <a href={data.event_url} target="_blank" className='inline-grid justify-center items-center text-2xl border-[1px] border-dotted border-black dark:border-white p-2 leading-[1rem] bg-blue-400 dark:text-black hover:bg-blue-800 hover:text-white transition-all'>
                            {data.event_url_text || 'Learn More'}
                        </a>
                    </div>
                    <p className='font-light italic text-md text-center p-2'>
                        {data.location && <span>{data.location.city}, {data.location.state}</span>}
                        {data.date && <span> • {raceDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit', 
                            year: 'numeric'
                        })}</span>}
                        {data.distance_string && <span> • {data.distance_string}</span>}
                    </p>
                </div>
                
            </div>

        );
    }
}

export default RaceTile;