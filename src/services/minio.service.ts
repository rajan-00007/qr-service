import { minioClient } from "../config/minio";

export const uploadQRImageToMinio = async (base64Image: string): Promise<string> => {
    const bucketName = process.env.MINIO_BUCKET || "qrservice";

    // Extract the mime type and base64 string
    const matches = base64Image.match(/^data:image\/(\w+);base64,/);
    const ext = matches && matches[1] === 'jpeg' ? 'jpg' : (matches ? matches[1] : 'png');
    const mimeType = matches ? `image/${matches[1]}` : 'image/png';

    // The base64Image format: data:image/jpeg;base64,...
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const fileName = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Construct the public URL
    const isSSL = process.env.MINIO_USE_SSL === "true";
    const protocol = isSSL ? "https" : "http";

    let portStr = "";
    if (process.env.MINIO_PORT) {
        if ((isSSL && process.env.MINIO_PORT !== "443") || (!isSSL && process.env.MINIO_PORT !== "80")) {
            portStr = `:${process.env.MINIO_PORT}`;
        }
    }
    const endpoint = process.env.MINIO_ENDPOINT;
    const publicUrl = `${protocol}://${endpoint}${portStr}/${bucketName}/${fileName}`;

    // Upload the file to Minio synchronously so we don't block the response
    minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
        "Content-Type": mimeType,
    }).catch(() => { });

    return publicUrl;
};
