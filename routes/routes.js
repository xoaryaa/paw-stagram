const express = require('express');
const router = express.Router();
const User = require('../models/posts');
const Sos = require('../models/sos')
const Users = require('../models/register')
const multer = require("multer");
const Post = require('../models/posts');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Ngo = require('../models/ngo');

const fileUpload = require('express-fileupload')
const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage: storage,
}).single('image');


router.post('/add', upload, (req, res) => {
    const user = new Post({
        name: req.body.name,
        email: req.body.email,
        caption: req.body.cap,
        image: req.file.filename,
    });
    // console.log(req.file)
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: "success",
                message: "User added succesfully!",
            };
            res.redirect("/pawstagram");
        }
    });
});







router.get("/pawstagram", (req, res) => {
    Post.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("index", {
                title: "Home page",
                users: users,
            });

        }
    });
});

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
})

router.get("/", (req, res) => {
    res.render('homepage', { title: "Home" });
})

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
})



//NGO
router.get('/ngo', (req, res) => {
    res.render('ngo', { title: 'Ngo' });
})
router.post('/ngo', (req, res) => {
    const ngo = new Ngo({
        name: req.body.name,
        email: req.body.email,
    });
console.log(req.body)
    ngo.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'NGO registered successfully!',
            };

            res.redirect('/');
        }
    });
});



// EDIT USER

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Post.findById(id, (err, user) => {
        if (err) {
            res.redirect('/pawstagram');
        } else {
            if (user == null) {
                res.redirect('/pawstagram');
            } else {
                res.render('edit_users', {
                    title: "Edit User",
                    user: user,
                });
            }
        }
    });
});


router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    }
    else {
        new_image = req.body.old_image;
    }
    Post.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        caption: req.body.cap,
        image: new_image,
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        }
        else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully!',
            };
            res.redirect("/pawstagram");
        }
    })
});



// DELETE USER

router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    Post.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User deleted successfully!',
            };
            res.redirect('/pawstagram');
        }
    })
})

// SOS

router.get('/sos', (req, res) => {
    res.render("sos")
})
// router.use(fileUpload({
//     limits: {
//         fileSize: 10000000
//     },
//     abortOnLimit: true,
// }))

// var upload = multer({
//     storage: storage,
// }).single('myfile');

router.post('/sos',upload, async (req, res) => {
    const sos = new Sos({
        email: req.body.email,
      
        animalname: req.body.animalname,
        
        phone: req.body.phone,
       
        address: req.body.address,
    
        pincode: req.body.pincode,
        
        image:req.file.filename,
        

    })
    // sos.save((err) => {
    //     if (err) {
    //         res.json({ message: err.message, type: 'danger' });
    //     } else {
    //         req.session.message = {
    //             type: "success",
    //             message: "User added succesfully!",
    //         };
    //         res.redirect("/pawstagram");
    //     }
    // });
    // const file = req.files.myfile
    // console.log(req.files.myfile)
    // const filePath = path.join(__dirname, 'public' , 'sosimages', req.files.myfile.name)
    // await file.mv(filePath, err => {
    //     if(err){
    //         console.log("hr=ere")
    //         res.status(500).send(err)
    //        return  res.redirect('/')
    //     }
    //     else{
    //         console.log("Successfully saved")
    //     }
    
    // })
    
   

    sos.save((err) => {
        if (err) {
            return res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: "success",
                message: "User added succesfully!",
            };
            res.redirect("/");
        }
    });

 






        //MAIL

        const transporter = nodemailer.createTransport({
            service: 'smtp@gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'tayshetearya@gmail.com',
                pass: process.env.PASS
            }

        })

        const ngoEmails= await Ngo.find({},{_id:0,name:0,__v:0})
        // console.log(ngoEmails)
       const updatedNgoEmails=ngoEmails.map(ngoObject=> ngoObject.email )
        // console.log(updatedNgoEmails)

       const sosArray=await Sos.find().sort({_id:-1})
        const latestSos= sosArray[0].image
        console.log(latestSos)
        // console.log(sosArray)
    //    console.log(sosImage)
        const mailOptions = {
            from: 'tayshetearya@gmail.com',
            to: updatedNgoEmails,
            subject: "Help needed!!!!",
            text: `sender's email: ${req.body.email}, sender's phone: ${req.body.phone}, sender's address: ${req.body.address}, sender's pincode: ${req.body.pincode} `,
            // html: '<img class="img-fluid" src="https://www.linkpicture.com/q/paw.jpg">',
            attachments : [
                {
                    filename:'homepage1.png',
                    path:`uploads/${latestSos}`,

                }
            ]
           

        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('email sent:' + info.response);
            }
        })
    });

    

    router.get('/login', (req, res) => {
        res.render("login")
    })




    router.post("/register", async (req, res) => {
        try {
            const password = req.body.password;
            const confirmpassword = req.body.confirmpassword;
            if (password === confirmpassword) {
                const userdata = new Users({
                    fullname: req.body.name,
                    email: req.body.email,
                    // mobile:req.body.mobile,
                    password: req.body.password,
                    confirmpassword: req.body.confirmpassword
                });

                const savedata = await userdata.save();
                res.status(201).redirect("/pawstagram");
            }
        } catch (error) {
            res.status(400).send(error)

        }
    });

    router.post("/login", async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const useremail = await Users.findOne({ email: email });
            //  const token = await useremail.mytoken();
            //  console.log("This is my token "+ token);

            //  res.cookie("jwt",token,{
            //      expires:new Date(Date.now() +50000),
            //      httpOnly:true
            //  });
            if (useremail.password === password) {
                res.status(201).redirect("/")
            } else {
                res.send("invalid login details")
            }
        } catch (error) {
            res.status(400).send("invalid loing detail")
        }
    });



    module.exports = router;
