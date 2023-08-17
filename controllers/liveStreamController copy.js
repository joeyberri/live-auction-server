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
  const { userId } = req;
  const streamKey = generateUniqueStreamKey(); // Implement this function

  try {
    //to be cleared
    const userId = "J0207932004M";

    const liveStream = new LiveStream({ userId, streamKey });

    await liveStream.save().then(() => {
      console.log('Live stream registered');
    }).catch(err => console.error(err));

    // Publish the live stream using Node-Media-Server
    try {
      const session = nms.getSession(streamKey);
      console.log("NMS IS " + nms);
      if (session) {
        session.publish(streamKey);
        res.json({ message: 'Live stream started.', streamKey });
      } else {
        res.status(400).json({ message: 'Stream session not found.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error starting live stream.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error starting live stream.' });
  }
};

function generateUniqueStreamKey() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15); // Generate a random alphanumeric string
  const uniqueKey = `${timestamp}_${randomString}`;
  return uniqueKey;
}
// Implement other live stream-related actions
