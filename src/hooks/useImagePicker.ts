import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

type Params = {
  multiple?: boolean; // false по умолчанию: одна картинка
  selectionLimit?: number; // сколько можно выбрать за раз (0 = без лимита)
};

export function useImagePicker({ multiple = false, selectionLimit = 0 }: Params = {}) {
  const [permissionResponse, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const pick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: multiple,
      allowsEditing: !multiple,
      selectionLimit: multiple ? selectionLimit : 1,
      quality: 1,
    });

    if (result.canceled) return;

    const uris = result.assets.map((a) => a.uri);
    setImages(multiple ? (prev) => [...prev, ...uris] : uris);
  };

  const reset = () => setImages([]);

  return { images, image: images[0] ?? null, pick, reset };
}
