const express = require("express");
const { upload } = require("../helpers/filehelper");
const Authenticate = require("../middleware/authenticate");
const USER = require("../modelschemas/userschema");
const router = express.Router();

router.post("/upload_stud", Authenticate, async (req, res) => {
  const {
    python,
    c,
    cplus,
    js,
    sql,
    python_level,
    c_level,
    js_level,
    sql_level,
    cplus_level,
    english,
    english_level,
    hindi,
    hindi_level,
    developer,
    developer_status,
    work,
    git,
    linkedin,
    college_name,
    branch,
    year,
    cgpa,
    sscl_maths,
    sscl_phy,
    sscl_che,
    sslc_english,
    plustwo_maths,
    plustwo_phy,
    plustwo_che,
    plustwo_english,
    plustwo_cs,
  } = req.body;
  var user_id = req.userID;
  const userUpdate = await USER.findByIdAndUpdate(user_id, {
    education: [
      {
        institution_name: college_name,
        course: branch,
        year: year,
        cgpa: cgpa,
        sslc: [
          {
            phy: sscl_phy,
            che: sscl_che,
            maths: sscl_maths,
            english: sslc_english,
          },
        ],
        plustwo: [
          {
            phy: plustwo_phy,
            che: plustwo_che,
            maths: plustwo_maths,
            english: plustwo_english,
            cs: plustwo_cs,
          },
        ],
      },
    ],
    coding: [
      {
        languages: [
          python
            ? {
                language_name: "python",
                language_level: python_level,
              }
            : {},
          c
            ? {
                language_name: "c",
                language_level: c_level,
              }
            : {},
          js
            ? {
                language_name: "js",
                language_level: js_level,
              }
            : {},
          cplus
            ? {
                language_name: "c++",
                language_level: cplus_level,
              }
            : {},
          sql
            ? {
                language_name: "sql",
                language_level: sql_level,
              }
            : {},
        ],
        communication_languages: [
          english
            ? {
                language_name: "english",
                language_level: english_level,
              }
            : {},
          hindi
            ? {
                language_name: "hindi",
                language_level: hindi_level,
              }
            : {},
        ],
        development: [
          developer
            ? {
                developer: developer_status,
              }
            : {},
        ],
        working_status: work,
        links: [
          {
            github: git,
            linkedin: linkedin,
          },
        ],
      },
    ],
  });
  res.send(userUpdate);
});

router.get("/get_stud", async (req, res) => {
  try {
    const user = await USER.find();
    res.send(user);
    // console.log(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/get_stud_admin_want", async (req, res) => {
  try {
    var id = req.body.id;
    const user = await USER.findById(id);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/get_stud_profile", Authenticate, async (req, res) => {
  var id = req.userID;
  console.log(id);
  try {
    const user = await USER.findById(id);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
