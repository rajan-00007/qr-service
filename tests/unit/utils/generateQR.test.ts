import { generateQR } from '../../../src/utils/generateQR';

jest.setTimeout(30000);

describe('generateQR util', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should generate QR code and return qrUrl and qrImage with default base URL', async () => {
        const shortCode = 'test1234';
        const data = { metadata: { email: 'test@example.com', phone: '+1234567890' } };

        const result = await generateQR(shortCode, data);

        expect(result).toBeDefined();
        expect(result.qrUrl).toBe(`https://whereplus/qr/${shortCode}`);
        expect(result.qrImage).toMatch(/^data:image\/png;base64,/);
    });

    it('should use custom QR_BASE_URL from environment', async () => {
        process.env.QR_BASE_URL = 'https://custom.test.url/scan';
        const shortCode = 'custom-code';

        const result = await generateQR(shortCode, {});

        expect(result).toBeDefined();
        expect(result.qrUrl).toBe(`https://custom.test.url/scan/${shortCode}`);
    });

    it('should handle undefined data cleanly without throwing', async () => {
        const shortCode = 'nodata';

        const result = await generateQR(shortCode);

        expect(result).toBeDefined();
        expect(typeof result.qrImage).toBe('string');
        expect(result.qrUrl).toContain(shortCode);
    });

    it('should cover the logo fallback logic when logo is missing or load fails', async () => {
        const shortCode = 'logoTest';

        // Set the exported internal cachedLogoImg to null so it forces a refetch in the try/catch block
        const generateQRModule = require('../../../src/utils/generateQR');
        generateQRModule.cachedLogoImg = null;

        const canvas = require('canvas');
        const originalLoadImage = canvas.loadImage;

        // Mock the loadImage global function to resolve to a dummy or reject gracefully
        const loadImageSpy = jest.spyOn(canvas, 'loadImage')
            .mockImplementation(async (path: any) => {
                if (typeof path === 'string' && path.includes('logo.png')) {
                    throw new Error('Silent load failure for logo');
                }
                // Fallback to original implementation for other images (like the QR data URL)
                return originalLoadImage(path);
            });

        const result = await generateQRModule.generateQR(shortCode);
        expect(result).toBeDefined();

        loadImageSpy.mockRestore();
    });
});
