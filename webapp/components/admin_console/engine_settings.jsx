// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import ReactDOM from 'react-dom';
import * as Client from 'utils/client.jsx';
import * as AsyncClient from 'utils/async_client.jsx';

import {injectIntl, intlShape, defineMessages, FormattedMessage, FormattedHTMLMessage} from 'react-intl';

const holders = defineMessages({
    clientIdExample: {
        id: 'admin.engine.clientIdExample',
        defaultMessage: 'Ex "jcuS8PuvcpGhpgHhlcpT1Mx42pnqMxQY"'
    },
    clientSecretExample: {
        id: 'admin.engine.clientSecretExample',
        defaultMessage: 'Ex "jcuS8PuvcpGhpgHhlcpT1Mx42pnqMxQY"'
    },
    authExample: {
        id: 'admin.engine.authExample',
        defaultMessage: 'Ex ""'
    },
    tokenExample: {
        id: 'admin.engine.tokenExample',
        defaultMessage: 'Ex ""'
    },
    userExample: {
        id: 'admin.engine.userExample',
        defaultMessage: 'Ex ""'
    },
    saving: {
        id: 'admin.engine.saving',
        defaultMessage: 'Saving Config...'
    }
});

import React from 'react';

class EngineSettings extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            Enable: this.props.config.EngineSettings.Enable,
            saveNeeded: false,
            serverError: null
        };
    }

    handleChange(action) {
        var s = {saveNeeded: true, serverError: this.state.serverError};

        if (action === 'EnableTrue') {
            s.Enable = true;
        }

        if (action === 'EnableFalse') {
            s.Enable = false;
        }

        this.setState(s);
    }

    handleSubmit(e) {
        e.preventDefault();
        $('#save-button').button('loading');

        var config = this.props.config;
        config.EngineSettings.Enable = ReactDOM.findDOMNode(this.refs.Enable).checked;
        config.EngineSettings.Secret = ReactDOM.findDOMNode(this.refs.Secret).value.trim();
        config.EngineSettings.Id = ReactDOM.findDOMNode(this.refs.Id).value.trim();
        config.EngineSettings.AuthEndpoint = ReactDOM.findDOMNode(this.refs.AuthEndpoint).value.trim();
        config.EngineSettings.TokenEndpoint = ReactDOM.findDOMNode(this.refs.TokenEndpoint).value.trim();
        config.EngineSettings.UserApiEndpoint = ReactDOM.findDOMNode(this.refs.UserApiEndpoint).value.trim();

        Client.saveConfig(
            config,
            () => {
                AsyncClient.getConfig();
                this.setState({
                    serverError: null,
                    saveNeeded: false
                });
                $('#save-button').button('reset');
            },
            (err) => {
                this.setState({
                    serverError: err.message,
                    saveNeeded: true
                });
                $('#save-button').button('reset');
            }
        );
    }

    render() {
        const {formatMessage} = this.props.intl;
        var serverError = '';
        if (this.state.serverError) {
            serverError = <div className='form-group has-error'><label className='control-label'>{this.state.serverError}</label></div>;
        }

        var saveClass = 'btn';
        if (this.state.saveNeeded) {
            saveClass = 'btn btn-primary';
        }

        return (
            <div className='wrapper--fixed'>

                <h3>
                    <FormattedMessage
                        id='admin.engine.settingsTitle'
                        defaultMessage='Engine Settings'
                    />
                </h3>
                <form
                    className='form-horizontal'
                    role='form'
                >

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='Enable'
                        >
                            <FormattedMessage
                                id='admin.engine.enableTitle'
                                defaultMessage='Enable Sign Up With Engine: '
                            />
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='Enable'
                                    value='true'
                                    ref='Enable'
                                    defaultChecked={this.props.config.EngineSettings.Enable}
                                    onChange={this.handleChange.bind(this, 'EnableTrue')}
                                />
                                    <FormattedMessage
                                        id='admin.engine.true'
                                        defaultMessage='true'
                                    />
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='Enable'
                                    value='false'
                                    defaultChecked={!this.props.config.EngineSettings.Enable}
                                    onChange={this.handleChange.bind(this, 'EnableFalse')}
                                />
                                    <FormattedMessage
                                        id='admin.engine.false'
                                        defaultMessage='false'
                                    />
                            </label>
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.engine.enableDescription'
                                    defaultMessage='When true, Mattermost allows team creation and account signup using Engine OAuth.'
                                />
                                <br/>
                            </p>
                            <div className='help-text'>
                                <FormattedHTMLMessage
                                    id='admin.engine.EnableHtmlDesc'
                                    defaultMessage='<ol><li>Log in to your Engine account and go to Profile Settings -> Applications.</li><li>Enter Redirect URIs "<your-mattermost-url>/login/engine/complete" (example: http://localhost:8065/login/engine/complete) and "<your-mattermost-url>/signup/engine/complete". </li><li>Then use "Secret" and "Id" fields from Engine to complete the options below.</li><li>Complete the Endpoint URLs below. </li></ol>'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='Id'
                        >
                            <FormattedMessage
                                id='admin.engine.clientIdTitle'
                                defaultMessage='Id:'
                            />
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='Id'
                                ref='Id'
                                placeholder={formatMessage(holders.clientIdExample)}
                                defaultValue={this.props.config.EngineSettings.Id}
                                onChange={this.handleChange}
                                disabled={!this.state.Enable}
                            />
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.engine.clientIdDescription'
                                    defaultMessage='Obtain this value via the instructions above for logging into Engine'
                                />
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='Secret'
                        >
                            <FormattedMessage
                                id='admin.engine.clientSecretTitle'
                                defaultMessage='Secret:'
                            />
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='Secret'
                                ref='Secret'
                                placeholder={formatMessage(holders.clientSecretExample)}
                                defaultValue={this.props.config.EngineSettings.Secret}
                                onChange={this.handleChange}
                                disabled={!this.state.Enable}
                            />
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.gitab.clientSecretDescription'
                                    defaultMessage='Obtain this value via the instructions above for logging into Engine.'
                                />
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='AuthEndpoint'
                        >
                            <FormattedMessage
                                id='admin.engine.authTitle'
                                defaultMessage='Auth Endpoint:'
                            />
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='AuthEndpoint'
                                ref='AuthEndpoint'
                                placeholder={formatMessage(holders.authExample)}
                                defaultValue={this.props.config.EngineSettings.AuthEndpoint}
                                onChange={this.handleChange}
                                disabled={!this.state.Enable}
                            />
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.engine.authDescription'
                                    defaultMessage='Enter https://<your-engine-url>/oauth/authorize (example https://example.com:3000/oauth/authorize).   Make sure you use HTTP or HTTPS in your URL depending on your server configuration.'
                                />
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='TokenEndpoint'
                        >
                            <FormattedMessage
                                id='admin.engine.tokenTitle'
                                defaultMessage='Token Endpoint:'
                            />
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='TokenEndpoint'
                                ref='TokenEndpoint'
                                placeholder={formatMessage(holders.tokenExample)}
                                defaultValue={this.props.config.EngineSettings.TokenEndpoint}
                                onChange={this.handleChange}
                                disabled={!this.state.Enable}
                            />
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.engine.tokenDescription'
                                    defaultMessage='Enter https://<your-engine-url>/oauth/token.   Make sure you use HTTP or HTTPS in your URL depending on your server configuration.'
                                />
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='UserApiEndpoint'
                        >
                            <FormattedMessage
                                id='admin.engine.userTitle'
                                defaultMessage='User API Endpoint:'
                            />
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='UserApiEndpoint'
                                ref='UserApiEndpoint'
                                placeholder={formatMessage(holders.userExample)}
                                defaultValue={this.props.config.EngineSettings.UserApiEndpoint}
                                onChange={this.handleChange}
                                disabled={!this.state.Enable}
                            />
                            <p className='help-text'>
                                <FormattedMessage
                                    id='admin.engine.userDescription'
                                    defaultMessage='Enter https://<your-engine-url>/user.   Make sure you use HTTP or HTTPS in your URL depending on your server configuration.'
                                />
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <div className='col-sm-12'>
                            {serverError}
                            <button
                                disabled={!this.state.saveNeeded}
                                type='submit'
                                className={saveClass}
                                onClick={this.handleSubmit}
                                id='save-button'
                                data-loading-text={'<span class=\'glyphicon glyphicon-refresh glyphicon-refresh-animate\'></span> ' + formatMessage(holders.saving)}
                            >
                                <FormattedMessage
                                    id='admin.engine.save'
                                    defaultMessage='Save'
                                />
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

//config.EngineSettings.Scope = ReactDOM.findDOMNode(this.refs.Scope).value.trim();
//  <div className='form-group'>
//     <label
//         className='control-label col-sm-4'
//         htmlFor='Scope'
//     >
//         {'Scope:'}
//     </label>
//     <div className='col-sm-8'>
//         <input
//             type='text'
//             className='form-control'
//             id='Scope'
//             ref='Scope'
//             placeholder='Not currently used by Engine. Please leave blank'
//             defaultValue={this.props.config.EngineSettings.Scope}
//             onChange={this.handleChange}
//             disabled={!this.state.Allow}
//         />
//         <p className='help-text'>{'This field is not yet used by Engine OAuth. Other OAuth providers may use this field to specify the scope of account data from OAuth provider that is sent to Mattermost.'}</p>
//     </div>
// </div>

EngineSettings.propTypes = {
    intl: intlShape.isRequired,
    config: React.PropTypes.object
};

export default injectIntl(EngineSettings);
