import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { createQR } from "../services/qr.service";
import logger from "../utils/logger";

const PROTO_PATH = path.join(__dirname, "qr.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const qrProto: any = grpc.loadPackageDefinition(packageDefinition).qr;

async function generateQRHandler(call: any, callback: any) {
    try {
        const requestData = {
            routeKey: call.request.routeKey,
            referenceId: call.request.referenceId || call.request.hotel_id,
            externalUrl: call.request.externalUrl,
            metadata: call.request.metadata
        };

        const result = await createQR(requestData);

        callback(null, { qr_image_url: result.qrImageUrl });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: "Failed to generate QR"
        });
    }
}

export function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(qrProto.QRService.service, { GenerateQR: generateQRHandler });

    const GRPC_PORT = process.env.GRPC_PORT || "50051";

    server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            logger.error("Failed to bind gRPC server:", error);
            return;
        }
        logger.info(`gRPC Server running on PORT: ${port}`);
    });
}
