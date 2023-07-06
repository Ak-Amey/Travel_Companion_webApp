const router = require("express").Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
require('dotenv').config();



//Route1:  Create a user using POST:"/api/auth/createUser". No login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    //If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(),success });
    }

    //Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" ,success});
      }

      const salt = await bcryptjs.genSalt(10);
      secPass = await bcryptjs.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //jwt token
      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      return res.json({ success,authToken });
      //   return res.status(200).json({ message: "User created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }

    // .then(user=>res.json(user))
    // .catch(err=>{console.log(err)
    //  res.json({error:'Please enter unique value for email',message:err.message})
  }
);

//Route2: authenticate user using POST:"/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring information of user
    const { email, password } = req.body;
    try {
      //finding user in a database
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      //password comparison return bool
      const passwordCompare = await bcryptjs.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      //jwt token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      const success=true;
      return res.json({success, authToken });
      //error
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route3: Get loggedin user details using POST:"/api/auth/getUser". Login required
router.post(
  //fetch User is a middlewareused for authentication of user using token and then we are getting user details from database using id from token and then we are sending user details to frontend without password using select("-password") in findById method of mongoose
  "/getUser",fetchUser,async (req, res) => {
    try {
      //here we are removing password from the user object
      const user = await User.findById(req.user.id).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
