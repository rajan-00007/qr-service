import { Request, Response } from "express";
import { findByShortCode } from "../repositories/qrRepository";
import { produceQRScanEvent } from "../kafka/producer";
import logger from "../utils/logger";

export async function resolveQRController(req: Request, res: Response) {

  const shortCode = req.params.shortCode as string;

  const qr = await findByShortCode(shortCode);

  if (!qr) {
    return res.status(404).json({ error: "QR not found" });
  }

  // send Kafka event
  produceQRScanEvent({
    shortCode: qr.short_code,
    routeKey: qr.route_key,
    referenceId: qr.reference_id,
    timestamp: new Date().toISOString(),
  }).catch((err) => logger.error("Error producing QR scan event:", err));

  res.json(qr);

}