
import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema({
    name: { type: String, default: null },
    cuisines: [{ type: String }],
    locality: { type: String, unique: true },
    address: { type: String },
    rating: { type: String },
});
const Restaurant  = mongoose.model("restaurant", restaurantSchema)



const userSchema = new mongoose.Schema({
	firstName: { type: String, default: null },
	lastName: { type: String, default: null },
	email: { type: String, unique: true },
	password: { type: String },
	token: { type: String },
  });
  const User = mongoose.model("user", userSchema);

import jwt from 'jsonwebtoken'
import express from 'express'

import bcrypt from 'bcryptjs';
import verifyToken from "./middleware.js";


const router = express.Router()

// most important to serve static pages don't forget
// router.use(express.static('../public'))

router.post('/getrestaurants/:item?', verifyToken, async (req, res) => {
	const { item } = req.params
	const { body } = req
	let query = {}

	if (item) {
		// if searched from the search box
		query = {
			$or: [
				{ "name": { $regex: `${item}`, $options: 'i' } },
				{ "locality": { $regex: `${item}`, $options: 'i' } },
				{ "address": { $regex: `${item}`, $options: 'i' } },
				{ "cuisines": { $elemMatch: { $regex: `${item}`, $options: 'i' } } }
			]
		}
	} else if (body) {
		// if clicked from the list of restaurants
		const keys = Object.keys(body)
		keys.forEach((key) => {
			console.log('Key and its value :', key, body[key])
			query[key] = (key == 'cost') ? parseInt(body[key]) : { $regex: `${body[key]}`, $options: 'i' }
		})
	}
	// db call 
	try {
		const data = await Restaurant
			.find(query)
			.sort({ rating: -1 })

		res.send((data.length > 0) ? [...data] : [])
	} catch (error) {
		console.log('unable to get all the users', error)
		res.status(500).send([])
	}

})


router.post("/register", async (req, res) => {

	// Our register logic starts here
	try {
	  // Get user input
	  const { firstName, lastName, email, password } = req.body;
  
	  // Validate user input
	  if (!(email && password && firstName && lastName)) {
		res.status(400).send("All input is required");
	  }
  
	  // check if user already exist
	  // Validate if user exist in our database
	  const oldUser = await User.findOne({ email });
  
	  if (oldUser) {
		return res.status(409).send("User Already Exist. Please Login");
	  }
  
	  //Encrypt user password
	  const encryptedPassword = await bcrypt.hash(password, 10);
  
	  // Create user in our database
	  const user = await User.create({
		firstName,
		lastName,
		email: email.toLowerCase(), // sanitize: convert email to lowercase
		password: encryptedPassword,
	  });
  
	  // Create token
	  const token = jwt.sign(
		{ user_id: user._id, email },
		process.env.TOKEN_KEY,
		{
		  expiresIn: "2h",
		}
	  );
	  // save user token
	  user.token = token;
  
	  // returns new user
	  res.status(201).json(user);
	} catch (err) {
	  console.log(err);
	}
	// Our register logic ends here
  });
  
  router.post("/login", async (req, res) => {
  
	  // Our login logic starts here
	  try {
		// Get user input
		const { email, password } = req.body;
	
		// Validate user input
		if (!(email && password)) {
		  res.status(400).send("All input is required");
		}
		// Validate if user exist in our database
		const user = await User.findOne({ email });
	
		if (user && (await bcrypt.compare(password, user.password))) {
		  // Create token
		  const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
			  expiresIn: "2h",
			}
		  );
	
		  // save user token
		  user.token = token;
	
		  // user
		  res.status(200).json(user);
		}
		res.status(400).send("Invalid Credentials");
	  } catch (err) {
		console.log(err);
	  }
	  // Our register logic ends here
	});


export default router