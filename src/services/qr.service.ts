import { generateSnowflakeId } from "../utils/snowflake";
import { encodeBase62 } from "../utils/base62";
import { generateQR } from "../utils/generateQR";
import { insertQR } from "../repositories/qrRepository";
import { uploadQRImageToMinio } from "./minio.service";

export async function createQR(data: any) {

  const snowflakeId = generateSnowflakeId();

  const shortCode = encodeBase62(snowflakeId);

  const qrImage = await generateQR(shortCode, data);
  const qrImageUrl = await uploadQRImageToMinio(qrImage.qrImage);

  insertQR({
    shortCode,
    routeKey: data.routeKey,
    referenceId: data.referenceId,
    externalUrl: data.externalUrl,
    metadata: data.metadata,
    qrimage_url: qrImageUrl
  }).catch(() => { });

  return {
    id: shortCode,
    shortCode,
    qrUrl: qrImage.qrUrl,
    qrImage: qrImage.qrImage,
    qrImageUrl
  };
}