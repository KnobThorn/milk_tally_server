const express = require("express")
const authRouter = express.Router()
const jwt = require("jsonwebtoken")
const connection = require("../config/database")
const bcrypt = require("bcrypt")
const { decode } = require("punycode")


//get tallies by userid
authRouter.get("/tallies/:id", (req, res) => {
    try {
        connection.query(`select * from Produce_Tally where tally_user_id = '${req.params.id}'`, (err, result) => {
            if (err) {
                console.log(err)
            }
            res.send(result)

        })

    } catch (err) {
        console.log(err)

    }
})

//select only those whose role is member.
authRouter.get("/users", (req, res) => {
    try {
        connection.query(`select * from Users where user_role='member'`, (err, result) => {
            if (err) {
                console.log(err)
                res.send([])
            }
            res.send(result)

        })

    } catch (err) {
        console.log(err)
        res.send([])


    }

})


//this is a route for creating a new user who could be a member or a grader
authRouter.post("/register", (req, res) => {
    try {

        const { register_user_name, register_route_id, register_user_id, register_user_password, register_user_role, register_collection_center_id } = req.body;
        // we are encrpting the password
        bcrypt.hash(register_user_password, 10, (err, hash) => {

            if (err) {
                res.json({ created: false, msg: "user was not created" })
                console.log(err)

            } else {
                connection.query(`insert into Users (user_name, user_id, user_password, user_role, user_collection_center_id,user_route_number) values('${register_user_name}', '${register_user_id}', '${hash}', '${register_user_role}', '${register_collection_center_id}','${register_route_id}')`, (err, result) => {
                    if (err) {
                        res.json({ created: false, msg: "user was not created" })
                        console.log(err)
                    } else {

                        res.json({ created: true, msg: "user was  created successfully" })

                    }

                })
            }


        })


    } catch (err) {
        res.json({ created: false, msg: "user was not created" })
        console.log(err)


    }



})

authRouter.post("/login", (req, res) => {
    console.log("auth route accessed .... ")

    console.log(req.body)

    const { login_member_name, login_member_id, login_member_password } = req.body;

    connection.query(`select * from Users where user_name ='${login_member_name}' and user_id = '${login_member_id}' `, (err, result) => {
        if (err) {
            res.json({ msg: "unable to auhenticate", authenticated: false })
            console.log(err)
        } else {
            if (result.length == 0) {
                res.json({ msg: "Invalid  user details", authenticated: false })
                console.log(result)



            } else {
                // console.log(result[0].member_number)

                bcrypt.compare(login_member_password, result[0].user_password, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {

                        if (results) {
                            console.log(result)


                            const user = { member_id: result[0].user_id, user_role: result[0].user_role, user_name: result[0].user_name }

                            const token = jwt.sign(user, "i have a secret", { expiresIn: "1h" })
                            console.log(token, user)
                            res.json({ authenticated: true, role: user.user_role, token: token, msg: "sucessfully authenticated" })
                        } else {
                            res.json({ msg: "Invalid Login credentials", authenticated: false })

                        }
                    }

                })



            }
        }


    })


    authRouter.post("/member/verify", (req, res) => {
        console.log("am trying to authenticate")
        try {
            const token = req.body.token;
            jwt.verify(token, 'i have a secret', (err, decoded) => {

                if (err) {
                    res.status(200).json({ login: false, msg: "unable to authenticate" })
                } else {
                    console.log(decoded)
                    res.status(200).json({ login: true, member: decoded, msg: "You have been authenticated successfully" })

                }
            })



        } catch (err) {
            res.status(401).json({ msg: "unable to authenticated", login: false })

        }


    })











})
authRouter.get("/tally", (req, res) => {
    try {
        connection.query(`select * from Produce_Tally`, (err, result) => {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })

    } catch (error) {
        console.log(err)

    }
})




module.exports = authRouter;