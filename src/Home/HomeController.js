define([
    'spoon',
    'jquery',
    'api',
    './HomeView'
], function (spoon, $, api, HomeView) {

    'use strict';

    return spoon.Controller.extend({
        $name: 'HomeController',

        _view: null,
        _flickr: null,
        _page: 1,

        /**
         * Constructor.
         */
        initialize: function () {
            this.$super();

            this._view = this._link(new HomeView());
            this._view.appendTo('#content');

            // Build request object for convenience,
            // then ask for the data to be fetched.
            this._buildRequest();
            this.getData();

            // Listening for the View to request more data.
            // It will send the page it needs to be fetched.
            this._view.on('flickr', function (page) {
                console.log('Requesting page', page);
                this._page = page;
                this.getData(page);
            }.$bind(this));
        },

        /**
         * Makes the requests, waits until it's done,
         * then renders the view with the data.
         * @public
         */
        getData: function () {
            $.when(this._flickr.search('turkey'))
                .done(function (data) {
                    this._view.render({
                        data: data
                    });

                    this._view.unsetLoading();

                }.$bind(this))
                .fail(function (err) { console.log('failure', err); });
        },

        /**
         * Build the request call as needed.
         * @param     {String} q The search string.
         * @protected
         */
        _getUrl: function (q) {
            var id   = api,
                sort = 'interestingness-desc',
                stat = 'http://api.flickr.com/services/rest/';

            return stat + '?&method=flickr.photos.search&api_key=' +
                   id + '&text=' + q + '&sort=' + sort + '&page=' + this._page + '&per_page=20&safe_search=1&format=json';
        },

        /**
         * Buils the search request (and others, as needed).
         * @protected
         */
        _buildRequest: function () {
            this._flickr = {
                search: function (query) {
                    var deff = $.Deferred();

                    $.ajax({
                        url: this._getUrl(query) + '&jsoncallback=?',
                        dataType: 'json'
                    }).done(function (data) {
                        deff.resolve(data);
                    });

                    return deff.promise();
                }.$bind(this)
            };
        },

        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            this.$super();
        }
    });
});