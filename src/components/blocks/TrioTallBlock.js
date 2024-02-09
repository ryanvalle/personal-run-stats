import React, { Component } from 'react';
import Image from 'next/image';
import imageHelpers from '@/helpers/image';

class TrioTallBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div key={data.id} 
                className="grid grid-cols-3 gap-2 text-black max-w-screen-2xl place-self-center mx-[auto] pb-[10px]">
                    {data.images.length && data.images.map((image) => {
                        return (<div className='h-[250px] sm:h-[400px] md:h-[500px] lg:h-[800px] overflow-hidden relative bg-black loader' key={Buffer.from(image).toString('base64')}>
                            <span onClick={() => {imageHelpers.openModal(this.props, {images: [image]})}} className='relative w-full h-full block cursor-pointer'>
                                <Image 
                                    loader={imageHelpers.getImage}
                                    src={image}
                                    fill={true}
                                    quality={60}
                                    style={{objectFit: 'cover'}}
                                />
                            </span>
                        </div>)
                    })}                    
            </div>
        );
    }
}

export default TrioTallBlock;