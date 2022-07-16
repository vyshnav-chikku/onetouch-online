const express = require("express");
const USER = require("../modelschemas/userschema");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const cookieParser = require("cookie-parser"); //this is used for getting req.cookies in middleware otherwise we dont get cookies in req in middleware
const { upload } = require("../helpers/filehelper");
const Authenticate = require("../middleware/authenticate");

router.use(cookieParser());

router.post("/uploadstudinfo", (req, res) => {
  const name = req.body.name;
});

router.post("/signup", upload.single("file"), async (req, res) => {
  const final_path = req.file && req.file.path;

  const base64 = req.file && fs.readFileSync(final_path, "base64");
  const buffer = req.file && Buffer.from(base64, "base64");

  try {
    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
      res.send("pls fill the field properly");
    }

    const userExist = await USER.findOne({ email: email });

    if (userExist) {
      res.send({ status: 422, error: "Email is already present" });
    } else if (password === cpassword) {
      const user = new USER({
        name,
        email,
        phone,
        password,
        cpassword,
        profile: {
          data: req.file && buffer,
          contentType: req.file && req.file.mimetype,
        },
      });

      const userRegister = await user.save();

      if (userRegister) {
        res.send({ status: 200, message: "user registered successfully" });
      } else {
        res.send({ status: 422, error: "Failed to Registered" });
      }
    } else {
      res.send({ status: 422, error: "password must be equal" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).send("pls fill properly");
    } else {
      const userExist = await USER.findOne({ email: req.body.email });
      if (userExist) {
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
          res.status(404).send("check password");
        } else {
          const token = await userExist.generateAuthToken();
          res.cookie("jwt", token, {
            sameSite: "strict",
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
          });

          res.status(200).send("user login successfully");
        }
      } else {
        res.status(404).send("Invalid Credentials");
        //hacker dont know the problem is email or password
      }
    }
  } catch (e) {
    res.send("error");
    console.log("error", e);
  }
});

router.get("/signout", Authenticate, (req, res) => {
  res.clearCookie("jwt", { path: "/" }); //path : cookie path
  res.status(200).send("User logout");
});

//for getting data for frontend
router.get("/getData", Authenticate, async (req, res) => {
  try {
    res.status(200).send(req.rootUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
