// ====================================================================================================
//
// Cloud Code for Player_Update_Team, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Module");

var teamId = Spark.getData().TeamId;
var slot1 = Spark.getData().Slot1;
var slot2 = Spark.getData().Slot2;
var slot3 = Spark.getData().Slot3;
var slot4 = Spark.getData().Slot4;

var result = UpdateTeam(teamId, slot1, slot2, slot3, slot4);

Spark.setScriptData("Result", result);