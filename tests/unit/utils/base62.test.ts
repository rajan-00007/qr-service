import { encodeBase62 } from '../../../src/utils/base62';

describe('base62 util', () => {
    it('should encode 1 correctly', () => {
        const result = encodeBase62(1n);
        expect(result).toBe('1');
    });

    it('should encode 10 correctly', () => {
        const result = encodeBase62(10n);
        expect(result).toBe('a');
    });

    it('should encode 62 correctly', () => {
        const result = encodeBase62(62n);
        expect(result).toBe('10');
    });

    it('should handle large bigints', () => {
        const result = encodeBase62(123456789n);
        expect(result).toBe('8m0Kx');
    });

    it('should return empty string for 0n based on current implementation', () => {
        const result = encodeBase62(0n);
        expect(result).toBe('');
    });
});
