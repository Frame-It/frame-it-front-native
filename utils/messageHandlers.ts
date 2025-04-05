import { sendCodeToBackend } from '@/service/auth-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, Linking } from 'react-native';
export type TMessage =
  | { type: 'OPEN_IN_APP_BROWSER'; payload: { url: string } }
  | { type: 'SAVE_TOKEN'; payload: { token: string } }
  | { type: 'AUTH_CODE'; payload: { code: string } }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'READY' };

// 인앱 브라우저 열기
export const openInAppBrowser = (url: string) => {
  if (url) {
    Linking.openURL(url);
  } else {
    Alert.alert('오류', '유효한 URL이 없습니다.');
  }
};

// 토큰 저장하기
export const saveToken = async (token: string) => {
  if (token) {
    await AsyncStorage.setItem('accessToken', token);
  } else {
    Alert.alert('오류', '토큰 값이 없습니다.');
  }
};

// 토큰 만료 처리
export const tokenExpired = async () => {
  await AsyncStorage.removeItem('accessToken');
  Alert.alert('알림', '로그인이 만료되었습니다. 다시 로그인해주세요.');
  // TODO: refresh token 처리
};

interface AuthMessage {
  type: string;
  payload: {
    code: string;
    state?: string;
  };
}

export const login = async (payload: AuthMessage['payload']) => {
  try {
    if (payload.code && payload.state) {
      const authCode = payload.code;
      const state = payload.state;

      try {
        const resData = await sendCodeToBackend(authCode, state);

        await AsyncStorage.setItem('refreshToken', resData.refreshToken);
        return resData;
      } catch (error) {
        console.error('인증 중 에러:', error);
        Alert.alert('로그인 오류', '서버와 통신 중 문제가 발생했습니다.');
      }
    }
  } catch (error) {
    console.error('Error parsing incoming message:', error);
  }
};
