import React, { Component } from 'react';
import Head from 'next/head';
import Script from 'next/script';

class MetaHead extends Component {
    constructor() {
        super()
        const defaultTitle = 'running with ryan'
        this.state = {
            pageTitle: defaultTitle
        }
    }

    getTitle(d) {
        let dt = this.state.pageTitle;
        let rt = !!d.primary ? `${d.primary} • ${dt}` : dt
        return rt;
    }

    render() {
        var text = this.props.data || {};
        var image = this.props.image;
        var title = this.getTitle(text);
        return(
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta property="og:title" content={title} />
                {!!image && <meta property="og:image" content={image} />}
                {text.secondary && <meta name="description" content={text.secondary} /> }

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:site" content="@ryanvalle" />
                <meta property="twitter:title" content={title} />
                {!!image && <meta property="twitter:image" content={image} />}
                {text.secondary && <meta name="twitter:description" content={text.secondary} /> }

                <Script async type="text/javascript" src="/js/newrelic.js" />
                
            </Head>
        );
    }
}

export default MetaHead;