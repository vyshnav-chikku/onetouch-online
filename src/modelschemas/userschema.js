const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
    },
    profile: {
      data: Buffer,
      contentType: String,
    },
    Role: {
      type: Number,
      default: 0,
    },
    education: [
      {
        institution_name: {
          type: String,
          default: "",
        },
        course: {
          type: String,
          default: "",
        },
        year: {
          type: String,
          default: "",
        },
        cgpa: {
          type: String,
          default: "",
        },

        sslc: [
          {
            phy: {
              type: String,
              default: "",
            },
            che: {
              type: String,
              default: "",
            },
            maths: {
              type: String,
              default: "",
            },
            english: {
              type: String,
              default: "",
            },
          },
        ],
        plustwo: [
          {
            phy: {
              type: String,
              default: "",
            },
            che: {
              type: String,
              default: "",
            },
            maths: {
              type: String,
              default: "",
            },
            english: {
              type: String,
              default: "",
            },
            cs: {
              type: String,
              default: "",
            },
          },
        ],
      },
    ],
    coding: [
      {
        current_working_status: {
          type: String,
          default: "",
        },
        languages: [
          {
            language_name: {
              type: String,
              default: "",
            },
            language_level: {
              type: String,
              default: "",
            },
          },
        ],
        communication_languages: [
          {
            language_name: {
              type: String,
              default: "",
            },
            language_level: {
              type: String,
              default: "",
            },
          },
        ],
        development: [
          {
            developer: {
              type: String,
              default: "",
            },
          },
        ],
        working_status: {
          type: String,
          default: "not working",
        },
        links: [
          {
            github: {
              type: String,
              default: "",
            },
            linkedin: {
              type: String,
              default: "",
            },
          },
        ],
        frameworks: [],
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userschema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
      expiresIn: "50m",
    });
    console.log(token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log("auth", err);
  }
};

const USER = mongoose.model("USER", userschema);

module.exports = USER;
