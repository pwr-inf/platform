// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

package oauthengine

import (
	"bytes"
	"encoding/json"
	"github.com/mattermost/platform/einterfaces"
	"github.com/mattermost/platform/model"
	"io"
)

const (
	USER_AUTH_SERVICE_ENGINE = "engine"
)

type EngineProvider struct {
}

type EngineUser struct {
	Id       string
	Username string
	Email    string
	Name     string
	Surname  string
}

func StreamToByte(stream io.Reader) []byte {
	buf := new(bytes.Buffer)
	buf.ReadFrom(stream)
	return buf.Bytes()
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
	user.AuthData = glu.Id
	user.AuthService = USER_AUTH_SERVICE_ENGINE

	return user
}

func engineUserFromJson(data io.Reader) *EngineUser {
	user := &EngineUser{}

	var j map[string]interface{}
	err := json.Unmarshal(StreamToByte(data), &j)
	if err != nil {
		return nil
	}

	principal := j["principal"].(map[string]interface{})
	user.Id = string(principal["id"].(float64))
	user.Username = principal["username"].(string)
	user.Email = principal["email"].(string)
	user.Name = principal["name"].(string)
	user.Surname = principal["surname"].(string)
	return user
}

func (glu *EngineUser) IsValid() bool {
//	if strconv.Atoi(glu.Id) == 0 {
//		return false
//	}

	if len(glu.Email) == 0 {
		return false
	}

	return true
}

func (glu *EngineUser) getAuthData() string {
	return glu.Id
}

func (m *EngineProvider) GetIdentifier() string {
	return USER_AUTH_SERVICE_ENGINE
}

func (m *EngineProvider) GetUserFromJson(data io.Reader) *model.User {
	glu := engineUserFromJson(data)
	if glu.IsValid() {
		return userFromEngineUser(glu)
	}

	return &model.User{}
}

func (m *EngineProvider) GetAuthDataFromJson(data io.Reader) string {
	glu := engineUserFromJson(data)

	if glu.IsValid() {
		return glu.getAuthData()
	}

	return ""
}
