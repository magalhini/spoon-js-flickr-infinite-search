define([
    'spoon',
    'handlebars',
    'jquery',
    'text!./assets/tmpl/home.html',
    'css!./assets/css/home.css',
    'isotope'
], function (spoon, Handlebars, $, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'HomeView',
        _element: 'div.flickr',

        _el: null,
        _isLoading: false,
        _template: Handlebars.compile(tmpl),
        _page: 1,

        initialize: function () {
            this.$super();
            $(window).on('scroll', this.scrollCheck);
        },

        /**
         * Renders the view with the data.
         * @param  {Object} data Flickr results.
         * @public
         */
        render: function (data) {
            this._el = this.getElement();

            // The reason for this override is that by default
            // the content will be replaced... in this case,
            // we need for it to be appended.
            var template = this._template(data.data.photos);
            this._el.append(template);
        },

        /**
         * The request was done, ready for another.
         * @public
         */
        unsetLoading: function () {
            this._isLoading = false;
        },

        /**
         * Checks to see if the scroll is near the bottom.
         * If it is, increment the page and make the request for it.
         * @public
         */
        scrollCheck: function () {
            var contentHeight = this._el.height(),
                pageHeight    = document.documentElement.clientHeight,
                trigger       = 100, // trigger at 100px from the bottom
                scrollPos     = window.scrollY;

            if (!this._isLoading && contentHeight - pageHeight - scrollPos < trigger) {
                this._isLoading = true;
                this._page += 1;

                // The controller will listen to this.
                this._upcast('flickr', this._page);
            }
        }.$bound()
    });
});