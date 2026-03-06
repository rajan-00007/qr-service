import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "qr-service",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
});

export const producer = kafka.producer();

export default kafka;