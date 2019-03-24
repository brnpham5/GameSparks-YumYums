// ====================================================================================================
//
// Cloud Code for Character_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function GetCharacterBaseData(characterId) {
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Characters", characterId);
    
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

function GetCharacterLevelTable(characterId){
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Characters", "LevelTable" + characterId.toString());
    
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

function GetAllCharacterData() {
     //Load API and get entry
    var API = Spark.getGameDataService();

    var condition = API.N("CharacterId").gt(-1);
    var sortOrder = API.sort("CharacterId", true);
    var query = API.queryItems("Characters", condition, sortOrder);
    
    if(query.error()){
        //Output error script
        Spark.setScriptError("ERROR", query.error());
        //Stop execution of script
        Spark.exit();    
    } else{
         //Create empty object
        var data = {};
        //While there are still entries in the cursor retrieved from query
        while(query.cursor().hasNext()){
            //Get the entry
            entry = query.cursor().next();
            //Populate object with the entries. key = entry ID
            data[entry.getId()] = entry.getData();
        }
    }
   
    return data;
}
