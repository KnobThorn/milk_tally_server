const express = require("express")
const graderRouter = express.Router()
const connection = require("../config/database")

graderRouter.post("/grade", (req, res) => {
    console.log(req.body)
    try {

        const { grader_id, member_number, tally_time, tally } = req.body


        connection.query(`insert into Produce_Tally ( tally_grader_id, tally_user_id ,tally_time,tally) values( '${grader_id}', '${member_number}', '${tally_time}','${tally}' )`, (err, result) => {
            if (err) {
                res.json({ msg: "unable to grade", graded: false })
                console.log(err)

            } else {
                console.log(result)
                res.json({ msg: " graded sucessfully", graded: true })

            }

        })

    } catch (err) {
        console.log(err)
        res.json({ msg: "unable to grade", graded: false })
    }

})

graderRouter.post("/member/tally", (req, res) => {
    console.log(req.body)
    try {

        connection.query(`select * from Produce_Tally where tally_user_id = '${req.body.number}' and WEEK(tally_date) ='${req.body.week_number}'`, (err, result) => {
            if (err) {
                console.log(err)
                res.send("no data")
            } else {
                console.log(result)
                res.send(result)
            }



        })
    } catch (err) {

    }
})




module.exports = graderRouter;