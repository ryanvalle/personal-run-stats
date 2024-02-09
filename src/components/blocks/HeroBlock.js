import React, { Component } from 'react';
import Image from 'next/image';
import MetaHead from '../MetaHead';
import imageHelpers from '@/helpers/image';

class HeroBlock extends Component {
    constructor() {
        super();
    }

    render() {
        let data = this.props.data;
        return(
            <div className="inline-block w-full h-[400px] relative lg:h-[600px]">
                {(data.text.primary || data.text.secondary) && <MetaHead data={data.text} image={imageHelpers.getImage({ src: data.images[0], width: 1000, quality: 60})} />}
                <div className='w-full h-full block overflow-hidden relative loader'>
                    <Image 
                        loader={imageHelpers.getImage}
                        src={data.images[0]}
                        width={2000}
                        height={2000}
                        quality={80}
                        style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', transform: 'translateY(-50%)', top: '50%'}}
                        className="saturate-[.25]"
                    />
                </div>
                <div className='text-center grid place-items-center h-full w-full absolute pointer-events-none top-0'>
                    {(data.text.primary || data.text.secondary) && <div className='text-white dark:text-white bg-black/75 w-full py-[20px] px-[10px]'>
                        {data.text.primary && <h1 className='text-3xl lg:text-6xl font-bold '>{data.text.primary}</h1>}
                        {data.text.secondary && <h2 className='text-xl lg:text-3xl font-light pt-[0.25em]'>{data.text.secondary}</h2>}
                    </div>}
                </div>
            </div>
        );
    }
}

export default HeroBlock;