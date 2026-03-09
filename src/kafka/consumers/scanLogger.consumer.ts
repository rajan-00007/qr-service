import kafka from "../../config/kafka";
import logger from "../../utils/logger";

const consumer = kafka.consumer({ groupId: "logger-group-dev" });

export async function startLoggerConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: "qr-scanned", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {

      const event = JSON.parse(message.value!.toString());
      logger.info("Consumer 1 logged event:", event.shortCode);
    },
  });

}