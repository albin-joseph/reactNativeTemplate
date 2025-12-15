import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage save failed", e);
  }
};

export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Storage load failed", e);
    return null;
  }
};
