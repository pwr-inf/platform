// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

package oauthengine

import (
	"encoding/json"
	"github.com/mattermost/platform/einterfaces"
	"github.com/mattermost/platform/model"
	"io"
	"strconv"
)

const (
	USER_AUTH_SERVICE_ENGINE = "engine"
)

type EngineProvider struct {
}

type EngineUser struct {
	Id       int64  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
}

type EngineMessage struct {
	IsAuthenticated int64 `authenticated`
	User EngineUser `json:principal`
}

func init() {
	provider := &EngineProvider{}
	einterfaces.RegisterOauthProvider(USER_AUTH_SERVICE_ENGINE, provider)
}

func userFromEngineUser(glu *EngineUser) *model.User {
	user := &model.User{}
	username := glu.Username
	if username == "" {
		username = glu.Username
	}

	user.Username  = model.CleanUsername(username)
	user.FirstName = glu.Name
	user.LastName  = glu.Surname
	user.Email = glu.Email
	user.AuthData = strconv.FormatInt(glu.Id, 10)
	user.AuthService = USER_AUTH_SERVICE_ENGINE

	return user
}

func engineMessageFromJson(data io.Reader) *EngineMessage {
	decoder := json.NewDecoder(data)
	var glu EngineMessage
	err := decoder.Decode(&glu)
	if err == nil {
		return &glu
	} else {
		return nil
	}
}

func (glu *EngineMessage) IsValid() bool {
	if glu.IsAuthenticated != 1 {
		return false
	}
	if glu.User.Id == 0 {
		return false
	}

	if len(glu.User.Email) == 0 {
		return false
	}

	return true
}

func (glu *EngineUser) getAuthData() string {
	return strconv.FormatInt(glu.Id, 10)
}

func (m *EngineProvider) GetIdentifier() string {
	return USER_AUTH_SERVICE_ENGINE
}

func (m *EngineProvider) GetUserFromJson(data io.Reader) *model.User {
	glu := engineMessageFromJson(data)
	if glu.IsValid() {
		return userFromEngineUser(&glu.User)
	}

	return &model.User{}
}

func (m *EngineProvider) GetAuthDataFromJson(data io.Reader) string {
	glu := engineMessageFromJson(data)

	if glu.IsValid() {
		return glu.User.getAuthData()
	}

	return ""
}
