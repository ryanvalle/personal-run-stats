import React, { Component } from 'react';
import Link from 'next/link';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className={`w-screen text-left drop-shadow-md dark:text-black p-[20px] absolute z-[1] top-0 bg-white/75`}>
                <Link href="/">
                    <span className={`font-thin text-xl`}>📷 <span className="font-medium">photos</span>by<span className='font-medium'>ryan</span></span>
                </Link>
            </div>
        );
    }
}

export default Header;