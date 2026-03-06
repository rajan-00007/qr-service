import app from "./app";
import { startGrpcServer } from "./grpc/grpcServer";
import { startKafka } from "./kafka/startConsumers";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`QR Service running on PORT: ${PORT}`);
});

startGrpcServer();

/* startKafka().catch((err) => {
    console.warn(" Kafka failed to start (broker  may not be running):", err.message) ;
    console.warn("The app will continue without Kafka consumers.");
});
 */