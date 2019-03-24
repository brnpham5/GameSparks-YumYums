// ====================================================================================================
//
// Cloud Code for MetaData_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function GetPlayerMetaData() {
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("MetaData", "Player");
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var data = entry.getData();
        
        return data;
    }
}

function GetCharacterMetaData() {
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("MetaData", "Character");
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var data = entry.getData();
        
        return data;
    }
}

//TableId === character rarity
function GetCharacterRarityLevelTable(TableId){
    //Load API and get entry
    var API = Spark.getGameDataService();
        
    //Attempt to get entry
    var entryObject = API.getItem("MetaData", "CharacterLevel" + TableId);
        
     //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error());
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var result = entry.getData();
            
        return result;
    }
}