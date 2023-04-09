const express = require("express")

const connection = require("../config/database")
const createRouter = express.Router()


createRouter.post("/route", (req, res) => {


    console.log(req.body)
    try {

        const { route_number, route_area } = req.body

        connection.query(`insert into  Route (route_number,route_area) values('${route_number}','${route_area}')`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ msg: "unable to create a route", created: false })

            } else {
                res.json({ msg: " created a  route successfully", created: false })
            }

        })



    } catch (error) {
        console.log(error)

    }

})
createRouter.post("/collection", (req, res) => {
    console.log("Create collection accessed")
    console.log(req.body)
    try {
        const { collection_center_id, collection_center_location, route_number } = req.body
        connection.query(` insert into Collection_Center (collection_center_id,collection_center_location,route_number) values('${collection_center_id}','${collection_center_location}','${route_number}') `, (err, result) => {
            if (err) {
                res.json({ msg: "unable to add a center", created: false })
                console.log(err)
            } else {
                res.json({ msg: "created a collection center", created: true })


            }
        })

    } catch (error) {
        console.log(err)
        res.json({ msg: "unable to add a center", created: false })
        console.log(error)


    }
})

module.exports = createRouter;