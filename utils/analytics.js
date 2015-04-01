'use strict';

if (typeof window !== 'undefined' && typeof GA_TRACKING_CODE !== 'undefined') {
    (function (window, document, script, url, r, tag, firstScriptTag) {
        window['GoogleAnalyticsObject'] = r;
        window[r] = window[r] || function () {
            (window[r].q = window[r].q || []).push(arguments)
        };
        window[r].l = 1 * new Date();
        tag = document.createElement(script),
            firstScriptTag = document.getElementsByTagName(script)[0];
        tag.async = 1;
        tag.src = url;
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    })(
        window,
        document,
        'script',
        '//www.google-analytics.com/analytics.js',
        'ga'
    );

    var ga = window.ga;

    if (window.currentUser.trackingId) {
        ga('set', 'dimension1', window.currentUser.trackingId);
        ga('set', 'dimension2', "authorized");
    } else {
        ga('set', 'dimension2', "anonymous");
    }

    ga('create', {
        "trackingId": GA_TRACKING_CODE,
        "userId": window.currentUser.trackingId
    });


} else {
    ga = window.ga = function () {
        console.log(arguments)
    };
}

module.exports = {

    pageView: function (path) {
        window.ga('send', 'pageview', {
            page: path
        })
    },

    event: function (eventCategory, eventAction, eventLabel, eventValue) {
        window.ga('send', 'event', {
            eventCategory: eventCategory,
            eventAction: eventAction,
            eventLabel: eventLabel,
            eventValue: eventValue
        });
    }

};
