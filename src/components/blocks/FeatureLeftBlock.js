import React, { Component } from 'react';
import Image from 'next/image';
import imageHelpers from '@/helpers/image';

class FeatureLeftBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div className="w-full px-[5px] lg:px-[20px] mb-[10px] lg:mb-[20px] block lg:flex">
                <div className='w-full lg:w-2/3 xl:w-1/2 h-full block overflow-hidden relative bg-black loader'>
                    <span onClick={() => {imageHelpers.openModal(this.props, data)}} className='cursor-pointer'>
                        <Image 
                            loader={imageHelpers.getImage}
                            src={data.images[0]}
                            width={2000}
                            height={1000}
                            quality={60}
                            style={{objectFit: 'cover', width: '100%'}}
                        />
                    </span>
                </div>
                {(data.text.primary || data.text.secondary) && <div className="text-center w-full lg:w-1/3 xl:w-1/2 grid place-items-center">
                    <div className="bg-black w-11/12 p-[10px] lg:p-[20px] text-white my-[10px] lg:my-0">
                        {data.text.primary && <h2 className="text-lg md:text-2xl lg:text-lg xl:text-3xl font-semibold">{data.text.primary}</h2>}
                        {data.text.secondary && <p className={`text-lg xl:text-xl font-light ${!!data.text.primary && `border-t-[1px] lg:border-t-2 lg:border-dotted border-white lg:pt-2 lg:mt-2`}`}>{data.text.secondary}</p>}
                    </div>
                </div>}
            </div>
        );
    }
}

export default FeatureLeftBlock;