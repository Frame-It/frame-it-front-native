import { sendRefreshTokenToBackend } from '@/service/auth-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 토큰 만료 처리
export const getAccessToken = async () => {
  await AsyncStorage.removeItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (refreshToken) {
    const resData = await sendRefreshTokenToBackend(refreshToken);
    await AsyncStorage.setItem('accessToken', resData.accessToken);
    await AsyncStorage.setItem('refreshToken', resData.refreshToken);

    return resData.accessToken;
  } else {
    throw new Error(`there's no refresh token`);
  }
};

export const refreshTokenExpired = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  // TODO: 로그인 페이지로 이동
};
