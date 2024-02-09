import React, { Component } from 'react';
import Image from 'next/image';
import imageHelpers from '@/helpers/image';


class FeatureImage extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div className="w-full pb-[10px]">
                <div className='w-full h-full block overflow-hidden relative bg-black loader'>
                    <span onClick={() => {imageHelpers.openModal(this.props, data)}} className='cursor-pointer'>
                        <Image 
                            loader={imageHelpers.getImage}
                            src={data.images[0]}
                            width={3000}
                            height={1000}
                            style={{objectFit: 'cover', width: '100%'}}
                        />
                    </span>
                </div>
            </div>
        );
    }
}

export default FeatureImage;