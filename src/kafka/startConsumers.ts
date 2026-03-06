import kafka from "../config/kafka";
import { startLoggerConsumer } from "./consumers/scanLogger.consumer";
import { startProcessorConsumer } from "./consumers/scanProcessor.consumer";

export async function startKafka() {
    console.log("Starting Kafka consumers...");
    await Promise.all([startLoggerConsumer(), startProcessorConsumer()]);
    console.log("Kafka consumers started.");
}
