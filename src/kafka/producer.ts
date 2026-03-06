import { producer } from "../config/kafka";

export async function produceQRScanEvent(event: any) {

  await producer.connect();

  await producer.send({
    topic: "qr-scanned",
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  });
}