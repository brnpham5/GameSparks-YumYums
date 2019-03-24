// ====================================================================================================
//
// Cloud Code for Gacha_Get_Pools, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Gacha_Module");

var permanentPools = GetPermanentGachas();
var livePools = GetLiveGachas();

var GachaPoolData = {
    "PermanentPools": permanentPools,
    "LivePools": livePools
};

Spark.setScriptData("GachaPoolData", GachaPoolData);
