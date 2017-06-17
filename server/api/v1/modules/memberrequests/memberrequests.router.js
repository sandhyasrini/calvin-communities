const router = require('express').Router();

const controller = require('./memberrequests.controller');

/*
 * Effective URI of the API is GET /memberrequests/:id
 *
 * API for returning all lists of a specified id
 *
 * URL Parameter
 *  - Id: specify a specific id, to get all its lists
 *
 */

router.get('/:id', function(req, res) {

    try {
        id = req.params.id;
        controller.gettingValuesById(id, (err, results) => {
            if (err) {
                console.log("Error in controller.gettingValuesById error: ", err);
                return res.status(500).send({ error: "Error in operation, please try later..!" });
            }

            res.send(results);
        });
    } catch (err) {
        console.log("Unexpected error in fetching list for particular id ", err);
        res.status(500).send({ error: "Unexpected error occurred, please try again...!" });
    }


});


/*
 * Effective URI of the API is POST /memberrequests/send
 *
 * API for inserting the username and domain name if invite or request occured
 *
 */


router.post('/send', function(req, res) {
    try {

        values = req.body;
        
        controller.InsertData(values, (err) => {
            if (err) {
                console.log("Error in controller.InsertData error: ", err);
                return res.status(500).send({ error: "Error in operation, please try later..!" });
            }
            res.send("inserted");
        });
    } catch (err) {
        console.log("Unexpected error in inserting values ", err);
        res.status(500).send({ error: "Unexpected error occurred, please try again...!" });

    }
});





/*

 * Effective URI of the API is PATCH /memberrequests/action/:id
 *
 * API for updating the status for a specified id
 *
 * URL Parameter
 *  - Id: specify a specific id, to update particular id
 *
 */


router.patch('/action/:id', function(req, res) {
    try {
        id = req.params.id;
        bodyData = req.body;
        controller.updateStatus(id, bodyData, (err) => {
            if (err) {
                console.log("Error in controller.updateStatus error: ", err);
                return res.status(500).send({ error: "Error in operation, please try later..!" });
            }

            res.send("updated");
        });
    } catch (err) {
        console.log("Unexpected error in updating for particular id ", err);
        res.status(500).send({ error: "Unexpected error occurred, please try again...!" });
    }

});



/*
 * Effective URI of the API is DELETE /memberrequests/rejected/:id
 *
 * API for delete the row in a table of a specified id
 *
 * URL Parameter
 *  - Id: specify a specific id, to delete the row
 *
 */

router.delete('/rejected/:id', (req, res) => {
    try {
        id = req.params.id;
        controller.rejectedInviteRequest(id, (err) => {
            if (err) {
                console.log("Error in  controller.rejectedInviteRequest error: ", err);
                return res.status(500).send({ error: "Error in operation, please try later..!" });
            }
            res.send("Deleted");
        });
    } catch (err) {
        console.log("Unexpected error in deleting particular id ", err);
        res.status(500).send({ error: "Unexpected error occurred, please try again...!" });
    }

});

module.exports = router;