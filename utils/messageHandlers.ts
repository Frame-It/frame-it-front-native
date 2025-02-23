import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';

type TMessage =
  | { type: 'OPEN_IN_APP_BROWSER'; payload: { url: string } }
  | { type: 'SAVE_TOKEN'; payload: { token: string } }
  | { type: 'TOKEN_EXPIRED' };

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

// 메시지 핸들러 (메시지 타입에 따른 처리)
export const handleWebViewMessage = async (data: TMessage) => {
  try {
    switch (data.type) {
      case 'OPEN_IN_APP_BROWSER':
        openInAppBrowser(data.payload.url);
        break;

      case 'SAVE_TOKEN':
        await saveToken(data.payload.token);
        break;

      case 'TOKEN_EXPIRED':
        await tokenExpired();
        break;

      default:
        console.warn('알 수 없는 메시지 타입');
    }
  } catch (error) {
    console.error('메시지 파싱 오류:', error);
  }
};
