// ====================================================================================================
//
// Cloud Code for Store_Item_Reset, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Store_Item_Module");

var result = ResetStoreItemInventory();

Spark.setScriptData("Result", result);