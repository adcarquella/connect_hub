const {getDBConnection} = require("../../data/SQLPool");

async function getCallData(req, res){

    let connection
    console.log("getCallData");
    try {
        connection = await getDBConnection();

        const sql = `SELECT 
    cll_ID AS 'DBID',
    cl_site_ID AS 'SiteID',
    DATE_FORMAT(cll_start_date, '%d/%m/%Y %H:%i:%s') AS 'StartDate',
    DATE_FORMAT(cll_end_date, '%d/%m/%Y %H:%i:%s') AS 'EndDate',
    TIMESTAMPDIFF(SECOND, cll_start_date, cll_end_date) AS 'DurationSeconds',
    SEC_TO_TIME(TIMESTAMPDIFF(SECOND, cll_start_date, cll_end_date)) AS 'Duration',
    cll_room AS 'Room',
    cll_type AS 'CallType',
    cll_zone AS 'Zone',
    cll_carer AS 'Carer',
    cll_fb_record_id AS 'FirebaseID',
    cll_panel_name AS 'PanelName',
    cll_journey_ref AS 'JourneyID',
    cll_call_origin AS 'CallOrigin',
    cll_callCode AS 'CallCode'
FROM tblCompiledCalls
WHERE cl_site_ID = 105 and cll_type <> ""
ORDER BY cll_start_date DESC
LIMIT 1000;`;

        const [calls] = await connection.promise().query(sql); 
        
        res.status(200).json(calls);

    }
    catch(e){
        console.log(e)
        res.status(500).json(e);
    }
    finally{
        if (connection) connection.release();
    }
    
}

module.exports = {getCallData};
