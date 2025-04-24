import { getAccessToken } from '@/utils/login';
import {
  login,
  openInAppBrowser,
  saveToken,
  TMessage,
} from '@/utils/messageHandlers';
import { useState } from 'react';

export const useMessageHandlers = () => {
  const [isWebReady, setIsWebReady] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const handleWebViewMessage = async (data: TMessage) => {
    try {
      switch (data.type) {
        case 'OPEN_IN_APP_BROWSER':
          openInAppBrowser(data.payload.url);
          break;

        case 'SAVE_TOKEN':
          await saveToken(data.payload.token);
          break;

        case 'ACCESS_TOKEN_EXPIRED':
          const accessToken = await getAccessToken();
          // console.log('ACCESS_TOKEN_EXPIRED', 'accessToken', accessToken);
          setAccessToken(accessToken);
          break;

        case 'AUTH_CODE':
          const loginData = await login(data.payload);
          setAuthData(loginData);
          break;

        case 'READY':
          setIsWebReady(true);
          break;

        default:
          console.warn('알 수 없는 메시지 타입');
      }
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
    }
  };

  return {
    handleWebViewMessage,
    isWebReady,
    authData,
    setAuthData,
    accessToken,
    setAccessToken,
  };
};
