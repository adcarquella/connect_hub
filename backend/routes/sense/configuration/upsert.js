const {getDBConnection} = require("../../../data/SQLPool");

async function sense_upsert(req, res){
    
    // const {user_guid, username} = req.body.payload;
    // console.log("username", username);
    let connection
    
    try {
        connection = await getDBConnection();

        const sql = `CALL upsert_sensor_settings(5, 123, '/devices/presence_sensor_fp2_8a68/events', 'Vayyaar', '003', TRUE, FALSE, '22:00:00', '06:00:00', '23:00:00', '07:00:00', TRUE, '00:00:00', '00:00:00', '00:00:00', '00:00:00');`;
        const [upsert_data] = await connection.promise().query(sql);
        console.log(sql);
        console.log("upsert_data", upsert_data);
        
        res.status(200).json(upsert_data[0][0]);

    }
    catch(e){
        console.log(e)
        res.status(500).json(e);
    }
    finally{
        if (connection) connection.release();
    }
    
}

module.exports = {sense_upsert};
