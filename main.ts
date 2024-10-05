import { PrismaClient } from "@prisma/client";
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Lang = require("./languages/Reponses");

require("dotenv").config();

//? settings
const port = 3030;
const secret = "aaa";
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

//? middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

function defineLangResponse(lang: string) {
  if (lang == "br") {
    return Lang.br;
  }
  if (lang == "en") {
    return Lang.en;
  }
}

app.get("/", async (req: any, res: any) => {
return res.json({servidor: "Servidor Online. 05/10/2024, 192.168.0.103."})
}

app.post("/api/auth/login", async (req: any, res: any) => {
  const { user, pass, lang } = req.body;
  let userLanguage = defineLangResponse(lang);
  try {
    const response = await prisma.user.findFirst({
      where: { name: user },
    });
    if (!response) {
      return res.json({ response: userLanguage?.userNotFound });
    } else {
      let t = jwt.sign({ id: response.userId }, secret);
      res
        .status(200)
        .cookie("access_token", "Bearer " + t, { maxAge: 86400 }) // 24hs de sessão
        .json({
          status: 1, // 0 offline 1 online
          name: response.name,
          storeId: response.storeIdOwner,
        });
    }
  } catch (error) {
    console.log("ERRO \n: " + error);
    res.status(500).json({ server: userLanguage?.apiError });
  }
});

app.listen(port, async () => {
  console.log("run");
});
