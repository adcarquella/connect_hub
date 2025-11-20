const {getDBConnection} = require("../../../data/SQLPool");

async function sense_get_settings(req, res){
 
    const payload = req.body    ;
    console.log(payload)
    const { siteCode } = payload;

    if (siteCode === undefined) {
        return res.status(400).json({ Message: "Missing siteCode" });
    }

    let connection
    
    try {
        connection = await getDBConnection();

        const sql = `call get_sensor_settings_by_site('${siteCode}')`;
        const [sense_data] = await connection.promise().query(sql);
        console.log(sense_data[0])
        const returnData = sense_data[0].map(d=>{

            return {
                "active": true,
                "advancedFall": d.advancedFall===0 ? false : true,
                "advancedPrevention": d.advancedPrevention === 0 ? false : true,
                "bedEnd": d.bedEnd,
                "bedStart": d.bedStart,
                "chairEnd": d.chairEnd,
                "chairStart": d.chairStart,
                "fallRisk": d.fallRisk===0 ?false:true,
                "fdEnd": d.fdEnd,
                "fdStart": d.fdStart,
                "fpEnd": d.fpEnd,
                "fpStart": d.fpStart,
                "pairedUnit": d.pairedUnit,
                "vayyarId": d.sense_id,
                "vayyarName": d.dv_deviceName,
                "vayyarZone": d.deviceZone,
                "zone1": "Bed",
                "zone1A": true,
                "zone2": "chair",
                "zone2A": true,
                "zone3": "bathroom",
                "zone3A": false,
                "zone4": "bedConfirm",
                "zone4A": false
            }

        })

        console.log("sense_data", sense_data[0]);
        res.status(200).json(returnData);
  
    }
    catch(e){
        console.log(e)
        res.status(500).json(e);
    }
    finally{
        if (connection) connection.release();
    }
    
}

module.exports = {sense_get_settings};