const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.options('/predict', cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use((req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json') && req.path !== '/predict') {
    return res.status(400).json({ error: "Content-Type must be 'application/json'" });
  }
  next();
});

const upload = multer({ dest: "uploads/" });

mongoose.connect("mongodb://localhost:27017/myLoginDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const dogEmotionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  predictedEmotion: {
    type: String, 
    required: true,
  },
}, { timestamps: true }); 

const DogEmotion = mongoose.model("DogEmotion", dogEmotionSchema);
module.exports = DogEmotion;
let model;
const loadModel = async () => {
  try {
    const modelPath = path.resolve(__dirname, "tfjs_model/model.json").replace(/\\/g, '/');
    console.log("Loading model from:", modelPath);
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully!");
  } catch (err) {
    console.log(err);
  }
};
loadModel();


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username: username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send("User registered successfully!");
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send("Invalid username or password.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).send("Login successful!");
    } else {
      res.status(401).send("Invalid username or password.");
    }
  } catch (err) {
    res.status(500).send("Error during login: " + err.message);
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users: " + err.message);
  }
});
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const filePath = path.join(__dirname, req.file.path);
    console.log("File path:", filePath);
    
    const imageBuffer = fs.readFileSync(filePath);
    const imageTensor = tf.node
      .decodeImage(imageBuffer, 3)
      .resizeNearestNeighbor([200, 200]) 
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255.0));

    const prediction = model.predict(imageTensor);
    const predictionsArray = await prediction.array();
    const predictedClass = prediction.argMax(-1).dataSync()[0];

    const scores = predictionsArray[0];
    const angerScore = scores[0];     
    const happinessScore = scores[1];  
    const relaxationScore = scores[2]; 
    const sadnessScore = scores[3];

    const emotionLevels = {
      anger: getEmotionLevel(angerScore),
      sadness: getEmotionLevel(sadnessScore),
      happiness: getEmotionLevel(happinessScore),
      relaxation: getEmotionLevel(relaxationScore)
    };

    function getEmotionLevel(score) {
      if (score < 0.3) {
        return 'low';
      } else if (score < 0.7) {
        return 'medium';
      } else {
        return 'high';
      }
    }

    res.json({ predictedClass, emotionLevels });

    fs.promises.unlink(filePath).catch(err => console.error("Error deleting file:", err));
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
