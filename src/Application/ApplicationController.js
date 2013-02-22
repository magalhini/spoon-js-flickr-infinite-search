define([
    'spoon',
    './ApplicationView',
    '../Home/HomeView',
    '../Home/HomeController'
], function (spoon, ApplicationView, HomeView, HomeController) {

    'use strict';

    return spoon.Controller.extend({
        $name: 'ApplicationController',

        _defaultState: 'home',
        _states: {
            'home': '_homeState',
            'homeId(id)': '_searchQuery'
        },

        _content: null,
        _view: null,

        ////////////////////////////////////////////////////////////

        /**
         * Constructor.
         */
        initialize: function () {
            this.$super();

            // Instantiate and render the application view
            this._view = this._link(new ApplicationView());
            this._view
                .appendTo(document.body)
                .render();
        },

        _searchQuery: function (state) {
            this._homeState(state);
        },

        /**
         * Home state handler.
         *
         * @param {Object} state The state parameter bag
         */
        _homeState: function (state) {
            this._destroyContent();
            this._content = this._link(new HomeController(state));
            this._content.setState(state);
        },

        /**
         * Destroys the current content if any.
         */
        _destroyContent: function () {
            if (this._content) {
                this._content.destroy();
                this._content = null;
            }
        },

        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            this._destroyContent();
            this.$super();
        }
    });
});