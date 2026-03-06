let sequence = 0;
let lastTimestamp = -1;

const machineId = 1;

function currentTimestamp(): number {
  return Date.now();
}

export function generateSnowflakeId(): bigint {

  let timestamp = currentTimestamp();

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & 4095;
  } else {
    sequence = 0;
  }

  lastTimestamp = timestamp;

  const id =
    (BigInt(timestamp) << 22n) |
    (BigInt(machineId) << 12n) |
    BigInt(sequence);

  return id;
}