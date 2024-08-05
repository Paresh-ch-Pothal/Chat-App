const express = require("express");
const app = express();
const User = require("../models/user");
const router = express.Router()
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "^&*c#h#@!@pp%$%&&&"
const multer = require("multer");
const path = require("path");
const fetchuser = require("../middleware/fetchuser");


//:::signup routes

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));

    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage })
app.use(express.static(path.join(__dirname, 'public')));



router.post("/signup", upload.single("pic"), async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: "Please provide all required fields" });
    }
    try {

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "Already a user is exist with the same email" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let pic = null;
        if (req.file) {
            const filePath = `/uploads/${req.file.filename}`;
            const baseURL = `${req.protocol}://${req.get('host')}`;
            pic = `${baseURL}${filePath}`;
        }
        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            pic: pic,
        })
        const payload = {
            user: {
                id: user._id
            }
        }
        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.json({ success: true, user, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }

})

//:::login routes
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ sucess: false, error: "please provide all the required fields" })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: "please provide correct information" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!password) {
            return res.status(400).json({ sucess: false, error: "please provide correct password" });
        }
        const payload = {
            user: {
                id: user._id
            }
        }
        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.json({ success: true, user, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }

})


//::::getuser routes
router.get("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }
})

//::update user name
router.put("/updatename/:id", fetchuser, async (req, res) => {
    try {
        const { name } = req.body;
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ success: true, error: "User is not found" })
        }
        const newName = { name };
        user = await User.findByIdAndUpdate(req.params.id, { $set: newName }, { new: true });
        return res.json({ success: true, user })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }
})

//update pic (profile image);

const storageNew = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));

    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const uploadNew = multer({ storage: storageNew })

router.put("/updateimage/:id", fetchuser, uploadNew.single("pic"), async (req, res) => {
    try {

        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send("Not found");
        }
        if (req.file) {
            const pic = `/uploads/${req.file.filename}`;
            const baseURL = `${req.protocol}://${req.get('host')}`;
            const Newpic = `${baseURL}${pic}`;
            user.pic = Newpic;
            await user.save();
        }
        return res.json({ success: true, pic: user.pic });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }
})

router.get("/getallusers",fetchuser, async (req, res) => {
    try {
        let allUsers = await User.find({ _id: { $ne: req.user.id } }).select("-password");
        return res.json(allUsers);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has been occured")
    }
})


module.exports = router;

