// ====================================================================================================
//
// Cloud Code for AuthenticationResponse, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

if(Spark.getData().newPlayer === true) {
    //Player Initialization Module
    require("Player_Initialization_Module");
    InitializeData();
}

if(Spark.getData().newPlayer === false) {
    //Player Initialization Module
    require("Player_Initialization_Module");
    InitializeData();
}

//Player Module
require("Player_Module");

var playerData = GetPlayerData();

Spark.setScriptData("Teams", playerData.Teams);
Spark.setScriptData("Characters", playerData.Characters);
Spark.setScriptData("Experience", playerData.Experience);
Spark.setScriptData("Level", playerData.Level);
Spark.setScriptData("Money", playerData.Money);
Spark.setScriptData("Energy", playerData.Energy);
Spark.setScriptData("Inventory", playerData.Inventory);
Spark.setScriptData("CampaignProgress", playerData.CampaignProgress);

require("Gacha_Module");

var permanentPools = GetPermanentGachas();
var livePools = GetLiveGachas();

var GachaPoolData = {
    "PermanentPools": permanentPools,
    "LivePools": livePools
};

Spark.setScriptData("GachaPoolData", GachaPoolData);