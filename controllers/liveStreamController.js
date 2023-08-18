const mediasoup = require('mediasoup');
const config = require('../config');
const LiveStream = require('../models/LiveStream');
// const mediasoup = require('mediasoup-client');
const socketClient = require('socket.io-client');
const socketPromise = require('../lib/socket.io-promise').promise;

let serverUrl;
let device;
let socket;
let producer;


// Utility function to generate a unique stream key
function generateUniqueStreamKey() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueKey = `PT-${randomString}_${timestamp}`;
  return uniqueKey;
}


// Function to create a Mediasoup worker
async function createMediasoupWorker() {
  return await mediasoup.createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });
}

// Function to create a Mediasoup router
async function createMediasoupRouter(worker) {
  const mediaCodecs = config.mediasoup.router.mediaCodecs;
  return await worker.createRouter({ mediaCodecs });
}

async function loadDevice(routerRtpCapabilities) {
  try {
    device = new mediasoup.Device();
  } catch (error) {
    if (error.name === 'UnsupportedError') {
      console.error('browser not supported');
    }
  }
  await device.load({ routerRtpCapabilities });
}

async function connect() {
  const opts = {
    path: '',
    transports: ['websocket'],
  };

  socket = socketClient(serverUrl, opts);
  socket.request = socketPromise(socket);

  socket.on('connect', async () => {
    const data = await socket.request('getRouterRtpCapabilities');
    await loadDevice(data);
  });

  socket.on('connect_error', (error) => {
    // console.error('could not connect to %s%s (%s)', serverUrl, opts.path, error.message);
    console.error('could not connect to %s%s (%s)', serverUrl, opts.path, error);
  });
}

exports.createLiveStream = async (req, res) => {
  try {
    const { producerId } = req.body; // Get userId from the request body

    // Generate a unique stream key
    const streamKey = generateUniqueStreamKey();

    // Construct the livestream URL
    // serverUrl = `https://${process.env.APP_BASE_URL}`;
    serverUrl = `rtmp://${process.env.APP_BASE_URL}/live/${streamKey}`;

    // Create a new live stream in your database
    const liveStream = await LiveStream.create({
      producerId,
      streamKey,
      url: serverUrl,
      status: 'pending', // Set the initial status
    });

    connect();
    // Create a Mediasoup worker
    const worker = await createMediasoupWorker();

    // Create a Mediasoup router
    const mediasoupRouter = await createMediasoupRouter(worker);

    // Create WebRTC transports
    const { producerTransport, consumerTransport } = await createWebRtcTransports(mediasoupRouter);

    // Additional Mediasoup setup specific to this live stream
    // You can save these transports or perform other actions here


    // Respond to the client with the stream key and livestream URL
    res.json({ streamKey, serverUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating live stream.' });
  }
};

// Function to create WebRTC transports
async function createWebRtcTransports(mediasoupRouter) {
  const {
    maxIncomingBitrate,
    initialAvailableOutgoingBitrate
  } = config.mediasoup.webRtcTransport;

  const producerTransport = await mediasoupRouter.createWebRtcTransport({
    listenIps: config.mediasoup.webRtcTransport.listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate,
  });

  const consumerTransport = await mediasoupRouter.createWebRtcTransport({
    listenIps: config.mediasoup.webRtcTransport.listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate,
  });

  if (maxIncomingBitrate) {
    await producerTransport.setMaxIncomingBitrate(maxIncomingBitrate);
    await consumerTransport.setMaxIncomingBitrate(maxIncomingBitrate);
  }

  return { producerTransport, consumerTransport };
}













exports.subscribeLiveStream = async () => {
  // get user external id from token and assign as subscriber to livestream
};

exports.listLiveStreams = async () => {
  // show all live streams
};

exports.listSubscribedUsers = async () => {
  // show all subscribed users for a particular stream key
};
