// ====================================================================================================
//
// Cloud Code for Store_Item_Purchase, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Store_Module");

var index = Spark.getData().Index;

var result = ItemStorePurchase(index);

Spark.setScriptData("Result", result);