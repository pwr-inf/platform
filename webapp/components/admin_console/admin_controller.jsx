// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import AdminSidebar from './admin_sidebar.jsx';
import AdminStore from 'stores/admin_store.jsx';
import TeamStore from 'stores/team_store.jsx';
import * as AsyncClient from 'utils/async_client.jsx';
import LoadingScreen from '../loading_screen.jsx';

import EmailSettingsTab from './email_settings.jsx';
import LogSettingsTab from './log_settings.jsx';
import LogsTab from './logs.jsx';
import AuditsTab from './audits.jsx';
import FileSettingsTab from './image_settings.jsx';
import PrivacySettingsTab from './privacy_settings.jsx';
import RateSettingsTab from './rate_settings.jsx';
import GitLabSettingsTab from './gitlab_settings.jsx';
import EngineSettingsTab from './engine_settings.jsx';
import SqlSettingsTab from './sql_settings.jsx';
import TeamSettingsTab from './team_settings.jsx';
import ServiceSettingsTab from './service_settings.jsx';
import LegalAndSupportSettingsTab from './legal_and_support_settings.jsx';
import TeamUsersTab from './team_users.jsx';
import TeamAnalyticsTab from '../analytics/team_analytics.jsx';
import LdapSettingsTab from './ldap_settings.jsx';
import ComplianceSettingsTab from './compliance_settings.jsx';
import LicenseSettingsTab from './license_settings.jsx';
import SystemAnalyticsTab from '../analytics/system_analytics.jsx';

import React from 'react';

export default class AdminController extends React.Component {
    constructor(props) {
        super(props);

        this.selectTab = this.selectTab.bind(this);
        this.removeSelectedTeam = this.removeSelectedTeam.bind(this);
        this.addSelectedTeam = this.addSelectedTeam.bind(this);
        this.onConfigListenerChange = this.onConfigListenerChange.bind(this);
        this.onAllTeamsListenerChange = this.onAllTeamsListenerChange.bind(this);

        var selectedTeams = AdminStore.getSelectedTeams();
        if (selectedTeams == null) {
            selectedTeams = {};
            selectedTeams[TeamStore.getCurrentId()] = 'true';
            AdminStore.saveSelectedTeams(selectedTeams);
        }

        this.state = {
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams,
            selected: props.tab || 'system_analytics',
            selectedTeam: props.teamId || null
        };
    }

    componentDidMount() {
        AdminStore.addConfigChangeListener(this.onConfigListenerChange);
        AsyncClient.getConfig();

        AdminStore.addAllTeamsChangeListener(this.onAllTeamsListenerChange);
        AsyncClient.getAllTeams();

        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    }

    componentWillUnmount() {
        AdminStore.removeConfigChangeListener(this.onConfigListenerChange);
        AdminStore.removeAllTeamsChangeListener(this.onAllTeamsListenerChange);
    }

    onConfigListenerChange() {
        this.setState({
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams: AdminStore.getSelectedTeams(),
            selected: this.state.selected,
            selectedTeam: this.state.selectedTeam
        });
    }

    onAllTeamsListenerChange() {
        this.setState({
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams: AdminStore.getSelectedTeams(),
            selected: this.state.selected,
            selectedTeam: this.state.selectedTeam

        });
    }

    selectTab(tab, teamId) {
        this.setState({
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams: AdminStore.getSelectedTeams(),
            selected: tab,
            selectedTeam: teamId
        });
    }

    removeSelectedTeam(teamId) {
        var selectedTeams = AdminStore.getSelectedTeams();
        Reflect.deleteProperty(selectedTeams, teamId);
        AdminStore.saveSelectedTeams(selectedTeams);

        this.setState({
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams: AdminStore.getSelectedTeams(),
            selected: this.state.selected,
            selectedTeam: this.state.selectedTeam
        });
    }

    addSelectedTeam(teamId) {
        var selectedTeams = AdminStore.getSelectedTeams();
        selectedTeams[teamId] = 'true';
        AdminStore.saveSelectedTeams(selectedTeams);

        this.setState({
            config: AdminStore.getConfig(),
            teams: AdminStore.getAllTeams(),
            selectedTeams: AdminStore.getSelectedTeams(),
            selected: this.state.selected,
            selectedTeam: this.state.selectedTeam
        });
    }

    render() {
        var tab = <LoadingScreen/>;

        if (this.state.config != null) {
            if (this.state.selected === 'email_settings') {
                tab = <EmailSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'log_settings') {
                tab = <LogSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'logs') {
                tab = <LogsTab/>;
            } else if (this.state.selected === 'audits') {
                tab = <AuditsTab/>;
            } else if (this.state.selected === 'image_settings') {
                tab = <FileSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'privacy_settings') {
                tab = <PrivacySettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'rate_settings') {
                tab = <RateSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'gitlab_settings') {
                tab = <GitLabSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'engine_settings') {
                tab = <EngineSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'sql_settings') {
                tab = <SqlSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'team_settings') {
                tab = <TeamSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'service_settings') {
                tab = <ServiceSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'legal_and_support_settings') {
                tab = <LegalAndSupportSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'ldap_settings') {
                tab = <LdapSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'compliance_settings') {
                tab = <ComplianceSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'license') {
                tab = <LicenseSettingsTab config={this.state.config}/>;
            } else if (this.state.selected === 'team_users') {
                if (this.state.teams) {
                    tab = <TeamUsersTab team={this.state.teams[this.state.selectedTeam]}/>;
                }
            } else if (this.state.selected === 'team_analytics') {
                if (this.state.teams) {
                    tab = <TeamAnalyticsTab team={this.state.teams[this.state.selectedTeam]}/>;
                }
            } else if (this.state.selected === 'system_analytics') {
                tab = <SystemAnalyticsTab/>;
            }
        }

        return (
            <div
                id='admin_controller'
                className='admin-controller'
            >
                <div
                    className='sidebar--menu'
                    id='sidebar-menu'
                />
                <AdminSidebar
                    selected={this.state.selected}
                    selectedTeam={this.state.selectedTeam}
                    selectTab={this.selectTab}
                    teams={this.state.teams}
                    selectedTeams={this.state.selectedTeams}
                    removeSelectedTeam={this.removeSelectedTeam}
                    addSelectedTeam={this.addSelectedTeam}
                />
                <div className='inner-wrap channel__wrap'>
                    <div className='row header'>
                    </div>
                    <div className='row main'>
                        <div
                            id='app-content'
                            className='app__content admin'
                        >
                        {tab}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AdminController.defaultProps = {
};

AdminController.propTypes = {
    tab: React.PropTypes.string,
    teamId: React.PropTypes.string
};
