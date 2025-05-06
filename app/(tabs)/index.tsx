import { useAndroidWebViewBackHandler } from '@/hooks/useAndroidWebViewBackHandler';
import { useMessageHandlers } from '@/hooks/useMessageHandlers';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function HomeScreen() {
  const webViewBaseUrl = Constants.expoConfig?.extra?.webviewUrl;
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  useAndroidWebViewBackHandler(webviewRef, canGoBack);

  const {
    handleWebViewMessage,
    isWebReady,
    authData,
    setAuthData,
    accessToken,
    setAccessToken,
    path,
  } = useMessageHandlers();
  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    await handleWebViewMessage(data);
  };

  useEffect(
    function refreshAccessToken() {
      if (isWebReady && accessToken && webviewRef.current) {
        const jsCode = `
          (async function () {
            if (typeof window.refreshAccessToken === 'function') {
              await window.refreshAccessToken('${accessToken}');
            } else {
              alert('window.refreshAccessToken is not defined');
            }
          })();
          true;
        `;
        webviewRef.current.injectJavaScript(jsCode);
        setAccessToken(null);
      }
    },
    [accessToken, webviewRef, isWebReady]
  );

  useEffect(
    function login() {
      if (isWebReady && authData && webviewRef.current) {
        const jsCode = `
          (async function () {
            if (typeof window.receiveAuthData === 'function') {
              await window.receiveAuthData(${JSON.stringify(authData)});
            } else {
              alert('window.receiveAuthData is not defined');
            }
          })();
          true;
        `;
        webviewRef.current.injectJavaScript(jsCode);
        setAuthData(null);
      }
    },
    [authData, isWebReady, webviewRef]
  );

  if (!webViewBaseUrl) return;

  return (
    <SafeAreaView style={styles.webviewContainer}>
      <WebView
        ref={webviewRef}
        source={{ uri: `${webViewBaseUrl}${path}` }}
        style={styles.webview}
        onMessage={handleMessage}
        userAgent={'FrameItWebView'}
        mixedContentMode={'always'}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
