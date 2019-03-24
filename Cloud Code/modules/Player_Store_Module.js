// ====================================================================================================
//
// Cloud Code for Player_Store_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function ItemStorePurchase(index){
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("PlayerData", playerId);
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var entryData = entry.getData();
        
        var itemStoreInventory = entryData.ItemStoreInventory;
        var item = itemStoreInventory.Contents[index];
        
        if(item.Available == true){
            var config = Spark.getConfig();
            var vGood  = config.getVirtualGood(item.ShortCode);
            var costs = vGood.getCurrencyCosts();
            
            var playerBalance;
            if(costs.Rubies !== undefined){
                var totalCost = costs.Money * item.Quantity;
                playerBalance = player.getBalance("Rubies");
                
                if(playerBalance > totalCost){
                    player.debit("Rubies", totalCost, "Purchased: " + vGood.getShortCode());
                    player.addVGood(item.ShortCode, item.Quantity);
                    
                    entryData.ItemStoreInventory.Contents[index].Available = false;
                } else {
                    Spark.setScriptError("ERROR", "Not enough Rubies")
                    Spark.exit();
                }
            } else if(costs.Money !== undefined){
                var totalCost = costs.Money * item.Quantity;
                playerBalance = player.getBalance("Money");
                
                if(playerBalance > totalCost){
                    player.debit("Money", totalCost, "Purchased: " + vGood.getShortCode());
                    player.addVGood(item.ShortCode, item.Quantity);
                    entryData.ItemStoreInventory.Contents[index].Available = false;
                } else {
                    Spark.setScriptError("ERROR", "Not enough Money")
                    Spark.exit();
                }
            }
            
            //Persist and return any errors
            var entryStatus = entry.persistor().persist().error();
            
            var result = {
                "Money": player.getBalance("Money"),
                "Rubies": player.getBalance("Rubies"),
                "ItemEntry": {
                    "ShortCode": item.ShortCode,
                    "Amount": player.hasVGood(item.ShortCode)
                }
            };
            
            //If there are errors the entry would not persist and we can act on that information
            if(entryStatus){
                //Output error script
                Spark.setScriptError("ERROR", entryStatus);
                //Stop execution of script
                Spark.exit();
            }
            
            return result;
        } else {
            Spark.setScriptError("ERROR", "Item no longer available");
            Spark.exit();
        }
        
    }
}

function SetItemStoreInventory(storeContents){
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("PlayerData", playerId);
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var entryData = entry.getData();
        
        var expireTime = new Date();
        expireTime.setHours(expireTime.getHours() + 1);
        
        for(var i = 0 ; i < storeContents.length; i++){
            storeContents[i].Available = true;
        }
        var newInventory = {};
        newInventory.Contents = storeContents;
        newInventory.ExpireTime = expireTime.toISOString();
        newInventory.CreateTime = new Date().toISOString();
        entryData.ItemStoreInventory = newInventory;
        
        //Persist and return any errors
        var entryStatus = entry.persistor().persist().error();
        
        //If there are errors the entry would not persist and we can act on that information
        if(entryStatus){
            //Output error script
            Spark.setScriptError("ERROR", entryStatus);
            //Stop execution of script
            Spark.exit();
        }
        
        return entryData.ItemStoreInventory;
    }
}

function MoneyStorePurchase(index){
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Stores", "MoneyStore");
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var entryData = entry.getData();
        
        var selection = entryData.Contents[index];
        
        var player = Spark.getPlayer();
        var playerBalance = player.getBalance("Rubies");
        
        if(playerBalance > selection.Price){
            player.debit("Rubies", selection.Price, "Purchasing money - debit: " + selection.Name);
            player.credit("Money", selection.Amount, "Purchasing money - credit: " + selection.Name);
        } else {
            Spark.setScriptError("Error", "Player does not have enough Rubies");
            Spark.exit();
        }
        
        var result = {
            "Money": player.getBalance("Money"),
            "Rubies": player.getBalance("Rubies")
        };
        
        return result;
    }
}