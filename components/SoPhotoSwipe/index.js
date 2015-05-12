import "photoswipe/dist/photoswipe.css"
import "photoswipe/dist/default-skin/default-skin.css"

import React from 'react'
import _ from "lodash"

import PhotoSwipe from "photoswipe/dist/photoswipe"
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default"

export default class SoPhotoSwipe extends React.Component {
    render() {
        return (
            <div className="pswp" tabindex="-1" role="dialog" aria-hidden="true">

                <div className="pswp__bg"></div>

                <div className="pswp__scroll-wrap">

                    <div className="pswp__container">
                        <div className="pswp__item"></div>
                        <div className="pswp__item"></div>
                        <div className="pswp__item"></div>
                    </div>

                    <div className="pswp__ui pswp__ui--hidden">

                        <div className="pswp__top-bar">


                            <div className="pswp__counter"></div>

                            <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>

                            <button className="pswp__button pswp__button--share" title="Share"></button>

                            <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                            <button className="pswp__button pswp__button--zoom" title="Zoom in/out"></button>


                            <div className="pswp__preloader">
                                <div className="pswp__preloader__icn">
                                    <div className="pswp__preloader__cut">
                                        <div className="pswp__preloader__donut"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                            <div className="pswp__share-tooltip"></div>
                        </div>

                        <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                        </button>

                        <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                        </button>

                        <div className="pswp__caption">
                            <div className="pswp__caption__center"></div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }

    componentDidMount() {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        // build items array
        var items = [
            {
                src: 'http://ic.pics.livejournal.com/fedor_konyuhov/66181884/23539/23539_900.jpg',
                w: 600,
                h: 400
            },
            {
                src: 'http://ic.pics.livejournal.com/fedor_konyuhov/66181884/24598/24598_900.jpg',
                w: 1200,
                h: 900
            },
            {
                src: 'http://ic.pics.livejournal.com/fedor_konyuhov/66181884/24394/24394_900.jpg',
                w: 1200,
                h: 900
            }
        ];

        // define options (if needed)
        var options = {
            // optionName: 'option value'
            // for example:
            index: 2 // start at first slide
        };

        // Initializes and opens PhotoSwipe
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    }
}