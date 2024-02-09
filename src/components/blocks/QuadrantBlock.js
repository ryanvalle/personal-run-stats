import React, { Component } from 'react';
import Image from 'next/image';
import imageHelpers from '@/helpers/image';

class QuadrantBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div key={data.id} 
                className="grid grid-cols-2 gap-2 text-black max-w-screen-2xl place-self-center mx-[auto] pb-[10px]">
                    {data.images.length && data.images.map((image) => {
                        return (<div className='h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden relative bg-black loader' key={Buffer.from(image).toString('base64')}>
                            <span onClick={() => {imageHelpers.openModal(this.props, {images: [image]})}} className='relative w-full h-full block cursor-pointer'>
                                <Image 
                                    loader={imageHelpers.getImage}
                                    src={image}
                                    fill={true}
                                    quality={60}
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                />
                            </span>
                        </div>)
                    })}                    
            </div>
        );
    }
}

export default QuadrantBlock;