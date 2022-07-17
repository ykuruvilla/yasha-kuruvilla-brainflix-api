const router = require("express").Router();

const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const videoJSONFileName = path.join(__dirname, "../data/videos.json");
const videos = require(videoJSONFileName);

const createSideVideo = (obj) => {
  const sideVideo = {
    id: obj.id,
    title: obj.title,
    channel: obj.channel,
    image: obj.image,
  };
  return sideVideo;
};

router.get("/", (_req, res) => {
  const sideVideoList = videos.map((video) => createSideVideo(video));
  res.status(200).json(sideVideoList);
});

router.get("/:videoId", (req, res) => {
  const videoFound = videos.some((video) => video.id === req.params.videoId);
  if (!videoFound) {
    res.status(404).json({
      errorMessage: `Video with id ${req.params.videoId} was not found`,
    });
  }
  const requestedVideo = videos.filter(
    (video) => video.id === req.params.videoId
  );
  res.status(200).json(requestedVideo[0]);
});

const writeToJsonFile = (filename, content) => {
  fs.writeFileSync(filename, JSON.stringify(content), "utf-8", (err) => {
    if (err) {
      console.log("Error: ", err);
    }
  });
  console.log(`changes saved to the file ${filename}.....`);
};

router.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.description) {
    console.log(req.body);
    return res.status(400).send({
      errorMessage: `Please provide a title and description for your video`,
    });
  }
  const newVideoObject = {
    title: req.body.title,
    channel: "BrainStation",
    image: "https://i.imgur.com/l2Xfgpl.jpg",
    description: req.body.description,
    views: 1001,
    likes: 2002,
    duration: "3:59",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
    id: uuidv4(),
  };

  writeToJsonFile(videoJSONFileName, [...videos, newVideoObject]);

  res.status(201).json({ newVideoCreated: newVideoObject, success: true });
});

module.exports = router;
