// ====================================================================================================
//
// Cloud Code for campaign_get_battle_data, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Battle_GetTeam");
require("Campaign_Module");

var nodeId = Spark.getData().NodeId;
var teamId = Spark.getData().TeamId;

//Player_Battle_GetTeam
var playerParty = GetTeamData(teamId);

//Campaign_Module
var nodeData = GetNodeData(nodeId);
var enemyParty = ParseEnemies(nodeData);
var background = nodeData.Background;

Spark.setScriptData("PlayerParty", playerParty);
Spark.setScriptData("EnemyParty", enemyParty);
Spark.setScriptData("Background", background);