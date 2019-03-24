// ====================================================================================================
//
// Cloud Code for Store_Item_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

const ItemStoreInventoryCount = 10;
const ItemStoreResetCost = 30;

function GetStoreItemInventory(){
    var player = Spark.getPlayer();
    require("Player_Module");
    var playerData = GetBasicPlayerData();

    var storeInventory;
    if(new Date(playerData.ItemStoreInventory.ExpireTime) < new Date()){
        return StoreItemGetNewInventory(playerData);
    } else {
        return StoreItemGetOldInventory(playerData);
    }
}

function StoreItemGetNewInventory(playerData){
    var storeData = GetStoreItemData(playerData.Level);
    
    var contents = storeData[0].Contents;
    var keys = Object.keys(contents);
    
    var storeContents = [];
    for(var i = 0; i < ItemStoreInventoryCount; i++){
        if(keys.length <= 0){
            break;
        }
        var roll = GetRndInteger(0, keys.length);

        var item = contents[keys[roll]];
        
        var config = Spark.getConfig();
        var vGood = config.getVirtualGood(item.ShortCode);
        
        item.Name = vGood.getName();
        item.Costs = vGood.getCurrencyCosts();

        storeContents.push(item);
        
        var propertySet = vGood.getPropertySet();
        if(propertySet.ItemType.Type == "Shard"){
            delete(contents[keys[roll]]);
            keys.splice(roll, 1);
        }
    }
    
    require("Player_Store_Module");
    return SetItemStoreInventory(storeContents);
}

function StoreItemGetOldInventory(playerData){
    return playerData.ItemStoreInventory;
}

function ResetStoreItemInventory(){
    var player = Spark.getPlayer();
    var playerBalance = player.getBalance("Rubies");
    
    if(playerBalance > ItemStoreResetCost){
        require("Player_Module");
        var playerData = GetBasicPlayerData();
        return StoreItemGetNewInventory(playerData);
    } else {
        Spark.setScriptError("ERROR", "Player does not have enough rubies");
        Spark.exit();
    }
}

function GetStoreItemData(PlayerLevel){
    //Load API and get entry
    var API = Spark.getGameDataService();

    var condition = API.N("Id").gt(0).and(API.S("Type").eq("Item")).and(API.N("MinLevel").lt(PlayerLevel + 1).and(API.N("MaxLevel").gt(PlayerLevel - 1)));
    var sortOrder = API.sort("Id", true);
    var query = API.queryItems("Stores", condition, sortOrder);
    
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
    }
    
    if(object.length > 1){
        Spark.setScriptError("ERROR", "More than one store has been returned");
        Spark.exit();
    } else if (object.length == 0){
        Spark.setScriptError("ERROR", "No store has been returned");
        Spark.exit();
    }
    return object;
}

function GetRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

