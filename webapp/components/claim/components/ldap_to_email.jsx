// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as Utils from 'utils/utils.jsx';
import * as Client from 'utils/client.jsx';

import React from 'react';
import ReactDOM from 'react-dom';
import {FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router';

export default class LDAPToEmail extends React.Component {
    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);

        this.state = {};
    }
    submit(e) {
        e.preventDefault();
        var state = {};

        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        if (!password) {
            state.error = Utils.localizeMessage('claim.ldap_to_email.pwdError', 'Please enter your password.');
            this.setState(state);
            return;
        }

        const confirmPassword = ReactDOM.findDOMNode(this.refs.passwordconfirm).value.trim();
        if (!confirmPassword || password !== confirmPassword) {
            state.error = Utils.localizeMessage('claim.ldap_to_email.pwdNotMatch', 'Passwords do not match.');
            this.setState(state);
            return;
        }

        const ldapPassword = ReactDOM.findDOMNode(this.refs.ldappassword).value.trim();
        if (!ldapPassword) {
            state.error = Utils.localizeMessage('claim.ldap_to_email.ldapPasswordError', 'Please enter your LDAP password.');
            this.setState(state);
            return;
        }

        state.error = null;
        this.setState(state);

        var postData = {};
        postData.email_password = password;
        postData.ldap_password = ldapPassword;
        postData.email = this.props.email;
        postData.team_name = this.props.teamName;

        Client.ldapToEmail(postData,
            (data) => {
                if (data.follow_link) {
                    browserHistory.push(data.follow_link);
                }
            },
            (error) => {
                this.setState({error});
            }
        );
    }
    render() {
        var error = null;
        if (this.state.error) {
            error = <div className='form-group has-error'><label className='control-label'>{this.state.error}</label></div>;
        }

        var formClass = 'form-group';
        if (error) {
            formClass += ' has-error';
        }

        return (
            <div>
                <h3>
                    <FormattedMessage
                        id='claim.ldap_to_email.title'
                        defaultMessage='Switch LDAP Account to Email/Password'
                    />
                </h3>
                <form onSubmit={this.submit}>
                    <p>
                        <FormattedMessage
                            id='claim.ldap_to_email.ssoType'
                            defaultMessage='Upon claiming your account, you will only be able to login with your email and password'
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id='claim.ldap_to_email.email'
                            defaultMessage='You will use the email {email} to login'
                            values={{
                                email: this.props.email
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id='claim.ldap_to_email.enterLdapPwd'
                            defaultMessage='Enter your LDAP password for your {team} {site} email account'
                            values={{
                                team: this.props.teamDisplayName,
                                site: global.window.mm_config.SiteName
                            }}
                        />
                    </p>
                    <div className={formClass}>
                        <input
                            type='password'
                            className='form-control'
                            name='ldapPassword'
                            ref='ldappassword'
                            placeholder={Utils.localizeMessage('claim.ldap_to_email.ldapPwd', 'LDAP Password')}
                            spellCheck='false'
                        />
                    </div>
                    <p>
                        <FormattedMessage
                            id='claim.ldap_to_email.enterPwd'
                            defaultMessage='Enter a new password for your email account'
                        />
                    </p>
                    <div className={formClass}>
                        <input
                            type='password'
                            className='form-control'
                            name='password'
                            ref='password'
                            placeholder={Utils.localizeMessage('claim.ldap_to_email.pwd', 'Password')}
                            spellCheck='false'
                        />
                    </div>
                    <div className={formClass}>
                        <input
                            type='password'
                            className='form-control'
                            name='passwordconfirm'
                            ref='passwordconfirm'
                            placeholder={Utils.localizeMessage('claim.ldap_to_email.confirm', 'Confirm Password')}
                            spellCheck='false'
                        />
                    </div>
                    {error}
                    <button
                        type='submit'
                        className='btn btn-primary'
                    >
                        <FormattedMessage
                            id='claim.ldap_to_email.switchTo'
                            defaultMessage='Switch account to email/password'
                        />
                    </button>
                </form>
            </div>
        );
    }
}

LDAPToEmail.defaultProps = {
};
LDAPToEmail.propTypes = {
    email: React.PropTypes.string,
    teamName: React.PropTypes.string,
    teamDisplayName: React.PropTypes.string
};
