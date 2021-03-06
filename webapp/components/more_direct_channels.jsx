// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {Modal} from 'react-bootstrap';
import FilteredUserList from './filtered_user_list.jsx';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';

import {FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router';
import SpinnerButton from 'components/spinner_button.jsx';

import React from 'react';

export default class MoreDirectChannels extends React.Component {
    constructor(props) {
        super(props);

        this.handleHide = this.handleHide.bind(this);
        this.handleShowDirectChannel = this.handleShowDirectChannel.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);

        this.createJoinDirectChannelButton = this.createJoinDirectChannelButton.bind(this);

        this.state = {
            users: this.getUsersFromStore(),
            loadingDMChannel: -1
        };
    }

    getUsersFromStore() {
        const currentId = UserStore.getCurrentId();
        const profiles = UserStore.getActiveOnlyProfiles();
        const users = [];

        for (const id in profiles) {
            if (id !== currentId) {
                users.push(profiles[id]);
            }
        }

        users.sort((a, b) => a.username.localeCompare(b.username));

        return users;
    }

    componentDidMount() {
        UserStore.addChangeListener(this.handleUserChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.handleUserChange);
    }

    handleHide() {
        if (this.props.onModalDismissed) {
            this.props.onModalDismissed();
        }
    }

    handleShowDirectChannel(teammate, e) {
        e.preventDefault();

        if (this.state.loadingDMChannel !== -1) {
            return;
        }

        this.setState({loadingDMChannel: teammate.id});
        Utils.openDirectChannelToUser(
            teammate,
            (channel) => {
                browserHistory.push(Utils.getTeamURLNoOriginFromAddressBar() + '/channels/' + channel.name);
                this.setState({loadingDMChannel: -1});
                this.handleHide();
            },
            () => {
                this.setState({loadingDMChannel: -1});
            }
        );
    }

    handleUserChange() {
        this.setState({users: this.getUsersFromStore()});
    }

    createJoinDirectChannelButton({user}) {
        return (
            <SpinnerButton
                className='btn btm-sm btn-primary'
                spinning={this.state.loadingDMChannel === user.id}
                onClick={this.handleShowDirectChannel.bind(this, user)}
            >
                <FormattedMessage
                    id='more_direct_channels.message'
                    defaultMessage='Message'
                />
            </SpinnerButton>
        );
    }

    render() {
        let maxHeight = 1000;
        if (Utils.windowHeight() <= 1200) {
            maxHeight = Utils.windowHeight() - 300;
        }

        return (
            <Modal
                dialogClassName='more-modal more-direct-channels'
                show={this.props.show}
                onHide={this.handleHide}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        <FormattedMessage
                            id='more_direct_channels.title'
                            defaultMessage='Direct Messages'
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FilteredUserList
                        style={{maxHeight}}
                        users={this.state.users}
                        actions={[this.createJoinDirectChannelButton]}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className='btn btn-default'
                        onClick={this.handleHide}
                    >
                        <FormattedMessage
                            id='more_direct_channels.close'
                            defaultMessage='Close'
                        />
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

MoreDirectChannels.propTypes = {
    show: React.PropTypes.bool.isRequired,
    onModalDismissed: React.PropTypes.func
};
