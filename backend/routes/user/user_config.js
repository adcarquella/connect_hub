const {getDBConnection} = require("../../data/SQLPool");

async function user_config(req, res){
    
    const {user_guid, username} = req.body.payload;
    console.log("username", username);
    let connection
    
    try {
        connection = await getDBConnection();

        const sql = `call GetUserSiteProfile_v2('${username}')`;
        const [user_data] = await connection.promise().query(sql);
        console.log(sql);
        console.log("user_data", user_data);
        res.status(200).json(user_data[0][0]);

    }
    catch(e){
        console.log(e)
        res.status(500).json(e);
    }
    finally{
        if (connection) connection.release();
    }
    
}

module.exports = {user_config};
