import kafka from "../../config/kafka";
import logger from "../../utils/logger";

const consumer = kafka.consumer({ groupId: "processor-group-dev" });

export async function startProcessorConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: "qr-scanned", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {

      const event = JSON.parse(message.value!.toString());
      logger.info("Consumer 2 processed event:", event.shortCode);
    },
  });

}
