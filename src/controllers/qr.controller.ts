import { Request, Response } from "express";
import { createQR } from "../services/qr.service";

export async function createQRController(req: Request, res: Response) {

  try {

    const result = await createQR(req.body);

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      error: "Failed to create QR"
    });
  }

}