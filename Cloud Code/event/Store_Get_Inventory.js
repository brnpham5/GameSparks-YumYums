// ====================================================================================================
//
// Cloud Code for Store_Get_Inventory, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Store_Item_Module");
require("Store_Money_Module");

Spark.setScriptData("Store_Item", GetStoreItemInventory());
Spark.setScriptData("Store_Money", GetStoreMoneyInventory());
