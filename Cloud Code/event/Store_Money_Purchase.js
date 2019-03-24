// ====================================================================================================
//
// Cloud Code for Store_Money_Purchase, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Store_Module");

var index = Spark.getData().Index;

var result = MoneyStorePurchase(index);

Spark.setScriptData("Result", result);