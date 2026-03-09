import kafka from "../config/kafka";
import { startLoggerConsumer } from "./consumers/scanLogger.consumer";
import { startProcessorConsumer } from "./consumers/scanProcessor.consumer";
import logger from "../utils/logger";
export async function startKafka() {
    logger.info("Starting Kafka consumers...");
    await Promise.all([startLoggerConsumer(), startProcessorConsumer()]);
    logger.info("Kafka consumers started.");
}
