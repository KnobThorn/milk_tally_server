const express = require("express")
const authRouter = express.Router()
const jwt = require("jsonwebtoken")
const connection = require("../config/database")

authRouter.post("/login", (req, res) => {
    console.log("auth route accessed .... ")

    console.log(req.body)

    const { login_member_name, login_member_id, login_member_password } = req.body;
    connection.query(`select * from Member where member_name ='${login_member_name}' and member_id = '${login_member_id}' and member_password = '${login_member_password}'`, (err, result) => {
        if (err) {
            res.json({ msg: "unable to retrieve data", authenticated: false })
            console.log(err)
        } else {
            if (result.length == 0) {
                res.json({ msg: "Invalid Login credentials", authenticated: false })


            } else {
                // console.log(result[0].member_number)
                const user = { member_id: result[0].member_id, member_name: result[0].member_name, member_collection_center_id: result[0].member_collection_center_id }

                const token = jwt.sign(user, "i have a secret", { expiresIn: "1h" })
                console.log(token, user)
                res.json({ authenticated: true, token: token, msg: "sucessfully authenticated" })

            }
        }


    })

    authRouter.post("/verify", (req, res) => {
        try {
            const token = req.body.token;
            jwt.verify(token, 'i have a secret', (err, decoded) => {

                if (err) {
                    res.status(401).json({ login: false, msg: "unable to authenticate" })
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




module.exports = authRouter;