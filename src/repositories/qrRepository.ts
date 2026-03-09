import pool from "../config/database";
import { v4 as uuidv4 } from "uuid";

interface QRData {
  shortCode: string;
  routeKey: string;
  referenceId?: string | null;
  externalUrl?: string | null;
  metadata?: any;
  qrimage_url?: string | null;
}

export async function insertQR(data: QRData) {

  const id = uuidv4();   // generate uuid

  const query = `
  INSERT INTO qr_profiles
  (id, short_code, route_key, reference_id, external_url, metadata, qrimage_url)
  VALUES ($1,$2,$3,$4,$5,$6,$7)
  RETURNING *;
  `;

  const values = [
    id,
    data.shortCode,
    data.routeKey,
    data.referenceId || null,
    data.externalUrl || null,
    data.metadata || {},
    data.qrimage_url || null
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}
export async function findByShortCode(shortCode: string) {

  const query = `
  SELECT short_code, route_key, reference_id
  FROM qr_profiles
  WHERE short_code = $1
  LIMIT 1;
  `;

  const result = await pool.query(query, [shortCode]);

  return result.rows[0] || null;
}