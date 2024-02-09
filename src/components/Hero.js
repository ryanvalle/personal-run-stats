import React, { Component } from 'react';

const DEFAULT_H1 = 'text-3xl lg:text-4xl';
const DEFAULT_P = 'text-xl lg:text-2xl';
const DEFAULT_POSITION = 'relative'

class Hero extends Component {
    constructor() {
        super();
        this.ref = React.createRef();
        this.state = {
            h1Classes: DEFAULT_H1,
            pClasses: DEFAULT_P,
            position: DEFAULT_POSITION
        }
    }

    render(props) {
        return(
            <div className="bg-bottom bg-cover flex dark:bg-gray-900">
                <div className={`w-screen text-left drop-shadow-md dark:text-white p-[20px] ${this.state.position}`} ref={this.ref}>
                    <h1 className={`font-normal ${this.state.h1Classes}`}>
                        <span className={`font-thin`}><span className="font-bold">running</span>with<span className='font-bold'>ryan</span>🏃‍♂️</span>
                    </h1>
                    <p className={`font-thin ${this.state.pClasses}`}>
                        A summary of my running. Est 2015.
                    </p>
                </div>
            </div>
        );
    }
}

export default Hero;