import kafka from "../../config/kafka";

const consumer = kafka.consumer({ groupId: "logger-group-dev" });

export async function startLoggerConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: "qr-scanned", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {

      const event = JSON.parse(message.value!.toString());
      console.log("Consumer 1 logged event:", event.shortCode);
    },
  });

}