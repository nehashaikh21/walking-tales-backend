import express from "express";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // DOES USER HAVE ACCOUNT
    const existingUser = await User.findOne({ email: email });
    console.log({ existingUser });
    if (existingUser === null) {
      res.status(400).send({
        success: false,
        message: "login failed. Check your credentials. Did you want to signup?",
      });
    } else {
      try {
        // DOES USER KNOW THE CORRECT PASSWORD
        const passwordIsCorrect = await existingUser.validatePassword(password);
        console.log({ passwordIsCorrect });
  
        if (!passwordIsCorrect) {
          res.status(400).send({
            success: false,
            message:
              "login failed. Check your credentials. Did you want to signup?",
          });
        } else {
          let token;
          try {
            token = jwt.sign(
              {
                userId: existingUser._id,
                email: existingUser.email,
                isLoggedIn: true,
              },
              process.env.SECRET,
              { expiresIn: "1h" }
            );
  
            res.status(201).json({
              success: true,
              message: "login successful",
              data: { token },
            });
          } catch (e) {
            console.log({ e });
            res.status(500).send({
              success: false,
              message: "login failed. Please try again later.",
            });
          }
        }
      } catch (e) {
        res.status(500).send({
          success: false,
          message: "registration failed. Please try again later.",
        });
      }
    }
  });


router.post("/register", async (req, res) => {
    const { email, password } = req.body;
  
    // check if is already used
    const existingUser = await User.findOne({ email: email });
    if (existingUser !== null) {
      res.status(400).send({
        success: false,
        message: "registration failed. Maybe you already have an account?",
      });
    } else {
      try {
        const createdUser = await User.create({ email, password });
        let token;
        try {
          token = jwt.sign(
            {
              userId: createdUser._id,
              email: createdUser.email,
              isLoggedIn: true,
            },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
  
          res.status(201).json({
            success: true,
            data: { token },
          });
        } catch (e) {
          res.status(200).send({
            success: true,
            message: "registration was successful. Please log in.",
          });
        }
      } catch (e) {
        res.status(500).send({
          success: false,
          message: "registration failed. Please try again later.",
        });
      }
    }
  });
  