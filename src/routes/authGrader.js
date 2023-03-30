const express = require("express")
const authGrader = express.Router()
const jwt = require("jsonwebtoken")
const connection = require("../config/database")

authGrader.post("/login/grader", (req, res) => {
    console.log(req.body)

    const { login_grader_name, login_grader_id, login_grader_password } = req.body;
    connection.query(`select * from Graders where grader_name ='${login_grader_name}' and grader_id = '${login_grader_id}' and grader_password = '${login_grader_password}'`, (err, result) => {
        if (err) {
            res.json({ msg: "unable to retrieve data", authenticated: false })
            console.log(err)
        } else {
            if (result.length == 0) {
                res.json({ msg: "Invalid Login credentials", authenticated: false })


            } else {

                const user = { grader_id: result[0].grader_id, grader_name: result[0].grader_name, grader_collection_center_id: result[0].grader_collection_center_id }
                const token = jwt.sign(user, "i have a secret", { expiresIn: "1h" })

                res.json({ authenticated: true, token: token })

            }
        }


    })

    authGrader.post("/grader/verify", (req, res) => {
        try {
            const token = req.body.token;
            jwt.verify(token, 'i have a secret', (err, decoded) => {

                if (err) {
                    res.status(401).json({ login: false, msg: "unable to authenticate" })
                } else {
                    console.log(decoded)
                    res.status(200).json({ login: true, grader: decoded, msg: "You have been authenticated successfully" })

                }
            })



        } catch (err) {
            res.status(401).json({ msg: "unable to authenticated", login: false })

        }

    })











})




module.exports = authGrader;