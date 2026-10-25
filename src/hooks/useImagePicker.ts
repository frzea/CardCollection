import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type Params = {
  multiple?: boolean; // false по умолчанию: одна картинка
  selectionLimit?: number; // сколько можно выбрать за раз (0 = без лимита)
};

type PickedImage = {
  key: string; // assetId или исходный uri — для дедупликации
  uri: string; // сжатый файл
};

const MAX_WIDTH = 1080;

// Уменьшаем до MAX_WIDTH (если картинка шире) и сжимаем в JPEG
async function compressImage(asset: ImagePicker.ImagePickerAsset): Promise<string> {
  const context = ImageManipulator.manipulate(asset.uri);

  // Маленькие картинки не увеличиваем
  if (asset.width > MAX_WIDTH) {
    context.resize({ width: MAX_WIDTH }); // высота посчитается сама, пропорции сохранятся
  }

  const image = await context.renderAsync();
  const saved = await image.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
  return saved.uri;
}

export function useImagePicker({ multiple = false, selectionLimit = 0 }: Params = {}) {
  const [items, setItems] = useState<PickedImage[]>([]);

  const pick = async () => {
    // сколько ещё можно выбрать (0 в selectionLimit = без лимита)
    const left = selectionLimit ? selectionLimit - items.length : 0;
    if (multiple && selectionLimit && left <= 0) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: multiple,
      allowsEditing: !multiple,
      selectionLimit: multiple ? left : 1,
      quality: 1,
    });

    if (result.canceled) return;

    // отсеиваем дубликаты ДО сжатия: и внутри выбора, и с уже выбранными
    const existing = new Set(multiple ? items.map((i) => i.key) : []);
    const fresh = result.assets.filter((a) => {
      const key = a.assetId ?? a.uri;
      if (existing.has(key)) return false;
      existing.add(key);
      return true;
    });

    const picked = await Promise.all(fresh.map(async (a) => ({ key: a.assetId ?? a.uri, uri: await compressImage(a) })));

    setItems((prev) => (multiple ? [...prev, ...picked].slice(0, selectionLimit || undefined) : picked));
  };

  const remove = (uri: string) => setItems((prev) => prev.filter((i) => i.uri !== uri));

  const reset = () => setItems([]);

  const images = items.map((i) => i.uri);

  return { images, image: images[0] ?? null, pick, remove, reset };
}
