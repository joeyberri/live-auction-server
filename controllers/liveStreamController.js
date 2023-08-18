const {
  types,
  version,
  observer,
  createWorker,
  getSupportedRtpCapabilities,
  parseScalabilityMode
} = require("mediasoup");

const util = require("util");


// Utility function to generate a unique stream key
function generateUniqueStreamKey() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueKey = `PT-${randomString}_${timestamp}`;
  return uniqueKey;
}

// Start a new live stream
exports.startLiveStream = async () => {
  try {
    const worker = await createWorker(); // Move this line inside an async function
    console.log("WORKER IS" + util.inspect(observer, { depth: null }));
    const router = await worker.createRouter();
    return generateUniqueStreamKey();
  } catch (error) {
    console.error(error);
    throw new Error('Error starting live stream.');
  }
};
