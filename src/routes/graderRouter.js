const express = require("express")
const graderRouter = express.Router()
const connection = require("../config/database")

graderRouter.post("/grade", (req, res) => {
    console.log(req.body)
    try {

        const { collection_center_id, grader_id, member_number, tally_time, tally } = req.body


        connection.query(`insert into Produce_Tally (collection_center_id, grader_id, member_number ,tally_time,tally) values('${collection_center_id}', '${grader_id}', '${member_number}', '${tally_time}','${tally}' )`, (err, result) => {
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




module.exports = graderRouter;