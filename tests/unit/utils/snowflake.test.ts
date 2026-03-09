import { generateSnowflakeId } from '../../../src/utils/snowflake';

describe('snowflake util', () => {
    it('should generate a snowflake ID as BigInt', () => {
        const id = generateSnowflakeId();
        expect(typeof id).toBe('bigint');
        expect(id > 0n).toBeTruthy();
    });

    it('should generate unique IDs on successive calls', () => {
        const id1 = generateSnowflakeId();
        const id2 = generateSnowflakeId();
        expect(id1).not.toBe(id2);
    });
});
