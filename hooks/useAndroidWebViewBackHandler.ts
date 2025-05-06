import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

export function useAndroidWebViewBackHandler(
  webViewRef: React.RefObject<WebView>,
  canGoBack: boolean
) {
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
  }, [canGoBack, webViewRef]);
}
