import {
  login,
  openInAppBrowser,
  saveToken,
  TMessage,
  tokenExpired,
} from '@/utils/messageHandlers';
import { useState } from 'react';

export const useMessageHandlers = () => {
  const [isWebReady, setIsWebReady] = useState(false);
  const [authData, setAuthData] = useState<any>(null);

  const handleWebViewMessage = async (data: TMessage) => {
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

  return { handleWebViewMessage, isWebReady, authData, setAuthData };
};
