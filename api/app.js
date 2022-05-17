import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { generatePairsImage } from './services/PairzService.js';

const hostname = process.env.HOSTNAME;
const port = process.env.HOST_PORT;
const corsURLs = process.env.CORS_ORIGINS;

const app = express();
app.use(express.json());
var corsOptions = {
  origin: function (origin, callback) {
    if (corsURLs.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  }
}

app.get("/health", async function (req, res) {
    res.status(200).send()
});

app.get('/pair', cors(corsOptions), async function (req, res) {
    try {
        const azukiId = req.query.azukiId;
        const beanzId = req.query.beanzId;

        const image = await generatePairsImage(azukiId, beanzId);

        res.set("Content-Type", "image/png");
        res.write(image);
        res.end();

        return;
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

app.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}/`);
})
