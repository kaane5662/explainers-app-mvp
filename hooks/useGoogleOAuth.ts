import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

interface GoogleOAuthResult {
  type: 'success' | 'cancel' | 'error';
  idToken?: string;
  accessToken?: string;
  error?: string;
}

export function useGoogleOAuth() {
  // Get platform-specific client ID
  const getClientId = () => {
    if (Platform.OS === 'ios') {
      return (
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS ||
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
        ''
      );
    } else if (Platform.OS === 'android') {
      return (
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID ||
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
        ''
      );
    } else {
      // Fallback to web client ID for development/web
      return (
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ||
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
        ''
      );
    }
  };

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'explainersapp', // matches app.json scheme
      }),
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: {
        include_granted_scopes: 'true',
      },
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    }
  );

  const signInWithGoogle = async (): Promise<GoogleOAuthResult> => {
    try {
      if (!request) {
        return { type: 'error', error: 'Auth request not ready' };
      }

      const result = await promptAsync();

      if (result.type === 'success') {
        const { id_token, access_token } = result.params;
        return {
          type: 'success',
          idToken: id_token,
          accessToken: access_token,
        };
      } else if (result.type === 'cancel') {
        return { type: 'cancel' };
      } else {
        return {
          type: 'error',
          error: 'Authentication failed',
        };
      }
    } catch (error) {
      return {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return {
    signInWithGoogle,
    isReady: !!request,
  };
}
