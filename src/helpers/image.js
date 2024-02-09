const imageHelpers = {
    getImageWithCrop: function({ src, width, quality }) {
        width = width >= 1500 ? 2000 : width
        if (src && src.length > 0) {
            src = src.replace('https://ik.imagekit.io/ryanvalle/', '').split('?')[0];
            let args = `tr:q-${quality || 90},w-${width},h-${width}`;

            return `https://ik.imagekit.io/ryanvalle/${args}/${src}`
        }
    },
    getImage: function({ src, width, quality }) {
        width = width >= 1500 ? 2000 : width;
        if (src && src.length > 0) {
            src = src.replace('https://ik.imagekit.io/ryanvalle/', '').split('?')[0];
            let args = `tr:q-${quality || 90},w-${width},h-${width},c-at_max`;

            return `https://ik.imagekit.io/ryanvalle/${args}/${src}`
        }
    },
    resetModal: function(props) {
        props.setDisplayImageModal && props.setDisplayImageModal(false);
        props.setModalData && props.setModalData({});
        if (window.gtag) {
            window.gtag('event', 'image_modal_close');
        }
        
    },
    openModal: function(props, data) {
        props.setDisplayImageModal(true);
        props.setModalData(data);

        if (window.gtag) {
            window.gtag('event', 'image_modal_open', data);
        }
    }
}

export default imageHelpers;