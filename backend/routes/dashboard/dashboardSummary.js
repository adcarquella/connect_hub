const {getDBConnection} = require("../../data/SQLPool");

async function getDashboardSummary(req, res){

    let connection

    
    try {
        connection = await getDBConnection();
        const sql = `select * from tblUserSites US join tblSites S on S.s_ID = US.us_SiteID where US.us_UserID = 3088;`;

        const [results] = await connection.promise().query(sql); 
console.log(results)
        res.status(200).json(results);

    }
    catch(e){
        res.status(500).json(e);
    }
    finally{
        if (connection) connection.release();
    }
    

    //call hub_dashboard_total_calls(3088, "2025-09-01", "2025-09-22");

    //res.send()
}

module.exports = {getDashboardSummary};
