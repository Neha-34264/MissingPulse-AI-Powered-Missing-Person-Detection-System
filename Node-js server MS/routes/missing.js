const express = require("express");
const router = express.Router();
const person = require("../models/person");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require('fs');
const path = require('path');  // Added to ensure correct path handling
const location = require("../models/location");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });  // Create the directory if it doesn't exist
}

// Multer storage configuration
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        const originalFilename = file.originalname;
        let idx = -1;
        for (let i = 0; i < originalFilename.length; i++) {
            if (originalFilename[i] === '.') {
                idx = i;
            }
        }
        const ext = originalFilename.substring(idx);
        const newFileName = req.body.name + "_" + req.body.cnic + ext;
        cb(null, newFileName);  // Save the file with the given name
    }
});

var upload = multer({
    storage: storage
}).single('image');

// ROUTE 1: To add missing person
router.post("/addperson", upload, async (req, res) => {
    try {
        const { name, email, Gender, identification, nationality, height, datemissing, address, cnic, phonenumber } = req.body;

        // Check if the file exists before proceeding
        if (!req.file) {
            return res.status(400).send('Image file is required');
        }

        // Log the uploaded file for debugging
        console.log('Uploaded file:', req.file);

        let newPerson = new person({
            name: name,
            email: email,
            Gender: Gender,
            identification: identification,
            nationality: nationality,
            height: height,
            Date_missing: datemissing,
            address: address,
            cnic: cnic,
            phonenumber: phonenumber,
            image: {
                data: fs.readFileSync('./uploads/' + req.file.filename),
                contentType: req.file.mimetype // Using the correct mime type from the file
            }
        });

        const savedPerson = await newPerson.save();
        console.log('Saved person:', savedPerson);
        res.json(savedPerson);
    } catch (error) {
        console.error('Error during saving missing person:', error.message);
        res.status(500).send('Some error occurred while saving the missing person');
    }
});

// ROUTE 2: To get all missing persons
router.get("/getallpersons", async (req, res) => {
    try {
        let missingPersons = await person.find();
        if (!missingPersons || missingPersons.length === 0) {
            return res.status(404).send("No missing persons found");
        }
        res.status(200).json(missingPersons);
    } catch (error) {
        console.error('Error during fetching all missing persons:', error.message);
        res.status(500).send('Some error occurred');
    }
});

// ROUTE 3: To delete a particular missing person by cnic
router.delete("/deleteperson/:id", async (req, res) => {
    try {
        let requiredPerson = await person.find({ cnic: req.params.id });

        if (!requiredPerson || requiredPerson.length === 0) {
            return res.status(404).send("Not Found");
        }

        // Deleting person
        await person.deleteOne({ cnic: req.params.id });

        // Also delete associated locations
        await location.deleteMany({ cnic: req.params.id });

        res.json({ success: "Person has been deleted" });
    } catch (error) {
        console.error('Error during deleting person:', error.message);
        res.status(500).send('Some error occurred');
    }
});

// ROUTE 4: To get all missing persons for a specific cnic
router.get("/getallpersons/:id", async (req, res) => {
    try {
        let missingPersons = await person.find({ cnic: req.params.id });

        if (!missingPersons || missingPersons.length === 0) {
            return res.status(404).send("Not Found");
        }

        res.status(200).json(missingPersons);
    } catch (error) {
        console.error('Error during fetching missing persons by cnic:', error.message);
        res.status(500).send('Some error occurred');
    }
});

module.exports = router;
