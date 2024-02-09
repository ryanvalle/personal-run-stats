import React, { Component } from 'react';
import Image from 'next/image';
import imageHelpers from '@/helpers/image';

class GridBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div key={data.id} 
                className="grid grid-cols-2 md:grid-cols-4 gap-1 text-black w-full my-[20px]">
                    {data.images.length && data.images.map((image) => {
                        return (<div className='aspect-square overflow-hidden relative loader bg-black' key={Buffer.from(image).toString('base64')}>
                            <span onClick={() => {imageHelpers.openModal(this.props, {images: [image]})}} className='relative w-full h-full block cursor-pointer'>
                                <Image 
                                    loader={imageHelpers.getImage}
                                    src={image}
                                    fill={true}
                                    style={{objectFit: 'contain', width: '100%', height: '100%'}}
                                    quality={60}
                                />
                            </span>
                        </div>)
                    })}                    
            </div>
        );
    }
}

export default GridBlock;