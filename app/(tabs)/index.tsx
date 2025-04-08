import { useMessageHandlers } from '@/hooks/useMessageHandlers';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function HomeScreen() {
  const webViewUrl = Constants.expoConfig?.extra?.webviewUrl;
  const webviewRef = useRef<WebView>(null);

  const { handleWebViewMessage, isWebReady, authData, setAuthData } =
    useMessageHandlers();
  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    await handleWebViewMessage(data);
  };

  useEffect(() => {
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
  }, [authData, isWebReady, webviewRef]);

  if (!webViewUrl) return;

  return (
    <SafeAreaView style={styles.webviewContainer}>
      <WebView
        ref={webviewRef}
        source={{ uri: webViewUrl }}
        style={styles.webview}
        onMessage={handleMessage}
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
