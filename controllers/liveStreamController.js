const LiveStream = require('../models/LiveStream');
const NodeMediaServer = require('node-media-server');

// Configuration for Node-Media-Server
const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
};

const nms = new NodeMediaServer(nmsConfig);
nms.run();

// Start a new live stream
exports.startLiveStream = async (req, res) => {
  // const { userId } = req;
  const userId = 'J0207932004M'

  try {
    const streamKey = generateUniqueStreamKey();
    const liveStream = new LiveStream({ userId, streamKey });

    await liveStream.save();

    // Respond to the client
    const rtmpUrl = `rtmp://${process.env.APP_BASE_URL}/live/${streamKey}`;

    res.json({ message: 'Server provisioned.', data: { 'streamKey': streamKey, 'rtmpUrl': rtmpUrl } });
  } catch (error) {
    // res.status(500).json({ message: 'Error starting live stream.' });
    res.status(500).json({ message: error });
  }
};

// View a live stream
exports.viewLiveStream = async (req, res) => {
  const streamKey = req.params.streamKey;

  try {
    // Retrieve the live stream by streamKey from the database
    const liveStream = await LiveStream.findOne({ streamKey }).then(console.log('Live stream with stream key ' + streamKey + ' found'));

    if (liveStream) {
      
      res.setHeader('Content-Type', 'video/x-flv'); 
      const session = nms.getSession(streamKey);
      console.log('Session is ' + session)
      if (session) {
        console.log('Session playing')
        session.play(streamKey);
        session.attach(req, res);
      }
    } else {
      res.status(404).json({ message: 'Stream not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error viewing live stream.' });
  }
};

function generateUniqueStreamKey() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueKey = `PT-${randomString}_${timestamp}`;
  return uniqueKey;
}
