import app from "./app";
import { startGrpcServer } from "./grpc/grpcServer";
import { startKafka } from "./kafka/startConsumers";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`QR Service running on PORT: ${PORT}`);
});

startGrpcServer();

/* startKafka().catch((err) => {
    console.warn(" Ka fka failed t o start (broker  may not be running) :", err.message) ;
    console.warn("The app will continue without Kafka consumers.");
});
 */