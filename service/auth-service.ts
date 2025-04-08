import Constants from 'expo-constants';

export const sendCodeToBackend = async (
  code: string,
  state: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${Constants.expoConfig?.extra?.apiUrl}/login/${state}?code=${code}&redirect_uri=${Constants.expoConfig?.extra?.webviewUrl}/login`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `서버 오류: ${response.status}, ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (e) {
    console.log(e);
  }
};
