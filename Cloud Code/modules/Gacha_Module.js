// ====================================================================================================
//
// Cloud Code for Gacha_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function GetGacha(gachaType, gachaId){
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Gacha", gachaType + "-" + gachaId);
    
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

function GetPermanentGachas() {
    //Load API and get entry
    var API = Spark.getGameDataService();

    var condition = API.S("Type").eq("Permanent");
    var sortOrder = API.sort("Id", true);
    var query = API.queryItems("Gacha", condition, sortOrder);
    
    if(query.error()){
        //Output error script
        Spark.setScriptError("ERROR", query.error());
        //Stop execution of script
        Spark.exit();    
    } else{
         //Create empty object
        var object = [];
        //While there are still entries in the cursor retrieved from query
        while(query.cursor().hasNext()){
            //Get the entry
            entry = query.cursor().next();
            //Populate object with the entries. key = entry ID
            entryData = entry.getData();
            
            object.push(entryData);
        }
        return object;
    }
    
}

function GetLiveGachas(){
    //Load API and get entry
    var API = Spark.getGameDataService();

    var condition = API.S("Type").eq("Scheduled").and(API.N("Id").gt(0)).and(API.S("DateStart").lt(new Date().toISOString())).and(API.S("DateEnd").gt(new Date().toISOString()));
    var sortOrder = API.sort("DateStart", true);
    var query = API.queryItems("Gacha", condition, sortOrder);
    
    if(query.error()){
        //Output error script
        Spark.setScriptError("ERROR", query.error());
        //Stop execution of script
        Spark.exit();    
    } else{
         //Create empty object
        var object = [];
        //While there are still entries in the cursor retrieved from query
        while(query.cursor().hasNext()){
            //Get the entry
            entry = query.cursor().next();
            //Populate object with the entries. key = entry ID
            entryData = entry.getData();
            
            entryData.DateStart = new Date(entryData.DateStart).toDateString();
            entryData.DateEnd = new Date(entryData.DateEnd).toDateString();
            
            object.push(entryData);
        }
        return object;
    }
}