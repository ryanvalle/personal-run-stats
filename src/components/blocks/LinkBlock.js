import Link from 'next/link';
import React, { Component } from 'react';

class LinkBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let text = (this.props.data || {}).text;
        let linkText = text.primary ||  'Return to Home';
        let linkUrl = text.secondary || '/';
        let padding = text.primary ? 'pt-[20px] pb-[10px] px-[10px] lg:pt-[20px] lg:pb-[20px] lg:px-[20px]' : 'px-[20px] py-[10px] lg:py-[20px]'
        return(
            <div className={`block w-full text-center ${padding}`}>
                <div className='border border-black rounded px-[20px] py-[10px] hover:bg-black hover:text-white inline-block m-0'>
                    <Link href={linkUrl} className='text-2xl'>
                        {linkText}
                    </Link>
                </div>
            </div>
        );
    }
}

export default LinkBlock;