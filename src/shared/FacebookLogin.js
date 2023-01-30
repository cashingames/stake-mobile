import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);

  const handleLoginFinished = (error, result) => {
    if (error) {
      console.log("login has error: " + result.error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          setAccessToken(data.accessToken);
        }
      );
    }
  };

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken.toString());
    }
  }, [accessToken]);

  return (
    <View>
      <LoginButton
        onLoginFinished={handleLoginFinished}
        onLogoutFinished={() => console.log("logout.")} />
    </View>
  );
};

export default Login;

