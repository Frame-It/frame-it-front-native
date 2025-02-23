import { handleWebViewMessage } from '@/utils/messageHandlers';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function HomeScreen() {
  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    await handleWebViewMessage(data);
  };
  const webViewUrl = Constants.expoConfig?.extra?.webviewUrl;

  if (!webViewUrl) return;

  return (
    <SafeAreaView style={styles.webviewContainer}>
      <WebView
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
