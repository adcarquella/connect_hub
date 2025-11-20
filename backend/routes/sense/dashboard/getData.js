const {getDBConnection} = require("../../../data/SQLPool");

async function dashboard_get_data(req, res){
    
    // const {user_guid, username} = req.body.payload;
    // console.log("username", username);
     let connection
    
    try {
        connection = await getDBConnection();

        /*
        const sql = `call GetUserSiteProfile_v2('${username}')`;
        const [user_data] = await connection.promise().query(sql);
        console.log(sql);
        console.log("user_data", user_data);
        
        res.status(200).json(user_data[0][0]);
        */

const timelineData = [
  {
    name: "Bed",
    segments: [
      { start: "00:00", end: "06:30", status: "in-bed", startTime: new Date("2025-10-15T00:00:00"), endTime: new Date("2025-10-15T06:30:00") },
      { start: "06:30", end: "07:00", status: "off", startTime: new Date("2025-10-15T06:30:00"), endTime: new Date("2025-10-15T07:00:00") },
      { start: "14:00", end: "15:00", status: "in-bed", startTime: new Date("2025-10-15T14:00:00"), endTime: new Date("2025-10-15T15:00:00") },
      { start: "21:15", end: "23:59", status: "in-bed", startTime: new Date("2025-10-15T21:15:00"), endTime: new Date("2025-10-15T23:59:00") },
    ],
  },
  {
    name: "Chair",
    segments: [
      { start: "07:15", end: "08:45", status: "in-chair", startTime: new Date("2025-10-15T07:15:00"), endTime: new Date("2025-10-15T08:45:00") },
      { start: "09:30", end: "11:30", status: "in-chair", startTime: new Date("2025-10-15T09:30:00"), endTime: new Date("2025-10-15T11:30:00") },
      { start: "12:30", end: "14:00", status: "in-chair", startTime: new Date("2025-10-15T12:30:00"), endTime: new Date("2025-10-15T14:00:00") },
      { start: "15:00", end: "17:00", status: "in-chair", startTime: new Date("2025-10-15T15:00:00"), endTime: new Date("2025-10-15T17:00:00") },
      { start: "17:20", end: "19:00", status: "in-chair", startTime: new Date("2025-10-15T17:20:00"), endTime: new Date("2025-10-15T19:00:00") },
      { start: "19:45", end: "21:00", status: "in-chair", startTime: new Date("2025-10-15T19:45:00"), endTime: new Date("2025-10-15T21:00:00") },
    ],
  },
  {
    name: "Bathroom",
    segments: [
      { start: "07:00", end: "07:15", status: "in-bathroom", startTime: new Date("2025-10-15T07:00:00"), endTime: new Date("2025-10-15T07:15:00") },
      { start: "17:00", end: "17:20", status: "in-bathroom", startTime: new Date("2025-10-15T17:00:00"), endTime: new Date("2025-10-15T17:20:00") },
      { start: "21:00", end: "21:15", status: "in-bathroom", startTime: new Date("2025-10-15T21:00:00"), endTime: new Date("2025-10-15T21:15:00") },
    ],
  },
  {
    name: "Room Presence",
    segments: [
      { start: "08:45", end: "09:30", status: "out-of-room", startTime: new Date("2025-10-15T08:45:00"), endTime: new Date("2025-10-15T09:30:00") },
      { start: "11:30", end: "12:30", status: "out-of-room", startTime: new Date("2025-10-15T11:30:00"), endTime: new Date("2025-10-15T12:30:00") },
      { start: "19:00", end: "19:45", status: "out-of-room", startTime: new Date("2025-10-15T19:00:00"), endTime: new Date("2025-10-15T19:45:00") },
    ],
  },
  {
    name: "Light Level V2",
    type: "numeric",
    segments: [
      { start: "00:00", end: "06:00", status: "light-off", level: 0, startTime: new Date("2025-10-15T00:00:00"), endTime: new Date("2025-10-15T06:00:00") },
      { start: "06:00", end: "07:00", status: "light -dim", level: 150, startTime: new Date("2025-10-15T06:00:00"), endTime: new Date("2025-10-15T07:00:00") },
      { start: "07:00", end: "09:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T07:00:00"), endTime: new Date("2025-10-15T09:00:00") },
      { start: "09:00", end: "17:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T09:00:00"), endTime: new Date("2025-10-15T17:00:00") },
      { start: "17:00", end: "19:00", status: "light-dim", level: 200, startTime: new Date("2025-10-15T17:00:00"), endTime: new Date("2025-10-15T19:00:00") },
      { start: "19:00", end: "21:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T19:00:00"), endTime: new Date("2025-10-15T21:00:00") },
      { start: "21:00", end: "22:00", status: "light-dim", level: 100, startTime: new Date("2025-10-15T21:00:00"), endTime: new Date("2025-10-15T22:00:00") },
      { start: "22:00", end: "23:59", status: "light-off", level: 0, startTime: new Date("2025-10-15T22:00:00"), endTime: new Date("2025-10-15T23:59:00") },
    ],
  },
];

const activityData = [
  { time: "00:00", status: "in-bed", duration: 120 },
  { time: "02:00", status: "in-bed", duration: 120 },
  { time: "04:00", status: "in-bed", duration: 120 },
  { time: "06:00", status: "in-bed", duration: 60 },
  { time: "07:00", status: "in-bathroom", duration: 15 },
  { time: "07:15", status: "in-chair", duration: 90 },
  { time: "08:45", status: "out-of-room", duration: 45 },
  { time: "09:30", status: "in-chair", duration: 120 },
  { time: "11:30", status: "out-of-room", duration: 60 },
  { time: "12:30", status: "in-chair", duration: 90 },
  { time: "14:00", status: "in-bed", duration: 60 },
  { time: "15:00", status: "in-chair", duration: 120 },
  { time: "17:00", status: "in-bathroom", duration: 20 },
  { time: "17:20", status: "in-chair", duration: 100 },
  { time: "19:00", status: "out-of-room", duration: 45 },
  { time: "19:45", status: "in-chair", duration: 75 },
  { time: "21:00", status: "in-bathroom", duration: 15 },
  { time: "21:15", status: "in-bed", duration: 165 },
];

const dailySummary = [
  { location: "In Bed", hours: 12.5, color: "hsl(var(--chart-1))", icon: "Bed" },
  { location: "In Chair", hours: 8.0, color: "hsl(var(--chart-2))", icon: "Armchair" },
  { location: "In Bathroom", hours: 0.8, color: "hsl(var(--chart-3))", icon: "Bath" },
  { location: "Out of Room", hours: 2.7, color: "hsl(var(--chart-4))", icon: "DoorOpen" },
];

const weeklyTrend = [
  { day: "Mon", inBed: 13, inChair: 7, inBathroom: 1, outOfRoom: 3 },
  { day: "Tue", inBed: 12, inChair: 8, inBathroom: 0.5, outOfRoom: 3.5 },
  { day: "Wed", inBed: 14, inChair: 6, inBathroom: 1, outOfRoom: 3 },
  { day: "Thu", inBed: 12.5, inChair: 8, inBathroom: 0.8, outOfRoom: 2.7 },
  { day: "Fri", inBed: 11, inChair: 9, inBathroom: 1.2, outOfRoom: 2.8 },
  { day: "Sat", inBed: 13.5, inChair: 7, inBathroom: 0.8, outOfRoom: 2.7 },
  { day: "Sun", inBed: 14, inChair: 6.5, inBathroom: 0.9, outOfRoom: 2.6 },
];

    const returnData = {
        timelineData,
        activityData,
        dailySummary,
        weeklyTrend
    };
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

module.exports = {dashboard_get_data};
