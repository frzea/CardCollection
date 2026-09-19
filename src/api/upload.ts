import { File, UploadTask, UploadType } from "expo-file-system";

export async function uploadImage(uri: string): Promise<string> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set your local IP.");
  }

  const file = new File(uri);
  const task = new UploadTask(file, `${apiUrl}/upload`, {
    uploadType: UploadType.MULTIPART,
    fieldName: "file",
  });

  const result = await task.uploadAsync(); // { body, status, headers }

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Upload failed: ${result.status}`);
  }

  const data: { path: string } = JSON.parse(result.body);
  return data.path;
}
