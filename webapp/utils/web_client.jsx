// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import Client from '../client/client.jsx';
import {browserHistory} from 'react-router';
import TeamStore from '../stores/team_store.jsx';
import BrowserStore from '../stores/browser_store.jsx';

const HTTP_UNAUTHORIZED = 401;

class WebClientClass extends Client {
    constructor() {
        super();
        this.logErrorsToConsole();
        TeamStore.addChangeListener(this.onTeamStoreChanged);
    }

    onTeamStoreChanged = () => {
        this.setTeamId(TeamStore.getCurrentId());
    }

    track = (category, action, label, property, value) => {
        if (global.window && global.window.analytics) {
            global.window.analytics.track(action, {category, label, property, value});
        }
    }

    trackPage = () => {
        if (global.window && global.window.analytics) {
            global.window.analytics.page();
        }
    }

    handleError = (err, res) => { // eslint-disable-line no-unused-vars
        if (err.status === HTTP_UNAUTHORIZED) {
            const team = window.location.pathname.split('/')[1];
            browserHistory.push('/' + team + '/login?extra=expired');
        }
    }

    login = (email, password, token, success, error) => { // eslint-disable-line no-unused-vars
        this.super.login(
            email,
            password,
            token,
            (data) => {
                this.track('api', 'api_users_login_success', '', 'email', data.email);
                BrowserStore.signalLogin();

                if (success) {
                    success(data);
                }
            },
            (err) => {
                this.track('api', 'api_users_login_fail', name, 'email', email);
                if (error) {
                    error(err);
                }
            }
        );
    }
}

var WebClient = new WebClientClass();
export default WebClient;