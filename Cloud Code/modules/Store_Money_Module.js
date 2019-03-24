// ====================================================================================================
//
// Cloud Code for Store_Money_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function GetStoreMoneyInventory(){
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Stores", "MoneyStore");
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error());
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var entryData = entry.getData();
        
        return entryData;
    }
}