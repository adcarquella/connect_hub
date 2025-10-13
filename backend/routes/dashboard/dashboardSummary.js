const {getDBConnection} = require("../../data/SQLPool");

async function getDashboardSummary(req, res){

    let connection
    
    try {
        connection = await getDBConnection();
        const sql = `select us_SiteID, s_Name, Sum(D.call_count) as "TotalCalls"
                        from tblUserSites US 
                        join tblSites S on S.s_ID = US.us_SiteID 
                        left join DailyCallCounts D on D.site_id = S.s_ID
                        where US.us_UserID = 3088
                        and D.call_date between "2025-09-01" and "2025-10-01"
                        group by us_SiteID, s_Name
                        order by s_Name;`;

        const [callTotals] = await connection.promise().query(sql); 
        const callTotalsObject = callTotals.map(r=>({
            "SiteID": r.s_ID,
            "SiteName": r.s_Name,
            "CallCount": r.TotalCalls
        }));

        


                const sql2 = `SELECT 
                            D.call_type,
                            SUM(CASE WHEN MONTH(D.call_date) = MONTH(CURRENT_DATE)
                                    AND YEAR(D.call_date) = YEAR(CURRENT_DATE)
                                    THEN D.call_count ELSE 0 END) AS current_month_calls,
                            SUM(CASE WHEN MONTH(D.call_date) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
                                    AND YEAR(D.call_date) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
                                    THEN D.call_count ELSE 0 END) AS previous_month_calls
                        FROM tblUserSites US
                        JOIN tblSites S 
                            ON S.s_ID = US.us_SiteID
                        LEFT JOIN DailyCallCountsExtended D 
                            ON D.site_id = S.s_ID
                        WHERE US.us_UserID = 3088
                        AND D.call_date >= DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), '%Y-%m-01')
                        AND D.call_date <  DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH), '%Y-%m-01')
                        GROUP BY D.call_type
                        ORDER BY D.call_type;`;

        const [callBreakdownData] = await connection.promise().query(sql2);
        
        let returnData = {
            "TotalCalls":callTotalsObject,
            "CallsBreakdown":callBreakdownData
        }
        console.log(returnData);
        res.status(200).json(returnData);

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
