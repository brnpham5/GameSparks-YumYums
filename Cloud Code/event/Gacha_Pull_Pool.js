// ====================================================================================================
//
// Cloud Code for Gacha_Pull_Pool, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Gacha_Pull_Module");

var gachaType = Spark.getData().GachaType;
var gachaId = Spark.getData().GachaId;

var pull = PullFromPool(gachaType, gachaId);

Spark.setScriptData("data", pull);