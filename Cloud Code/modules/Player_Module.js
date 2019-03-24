// ====================================================================================================
//
// Cloud Code for Player_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

function GetPlayerData(){
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
        var data = entry.getData();
        data.Inventory = GetVirtualGoods();
        data.Money = player.getBalance("Money");
        data.Energy = player.getBalance("Energy");
        
        require("Character_Calculate_Stats");
        require("Player_Character_GetLevelData");
        var charKeys = Object.keys(data.Characters);
        for(var k = 0; k < charKeys.length; k++) {
            var characterShortCode = charKeys[k];
            var character = data.Characters[characterShortCode];
            
            var stats = CalculateCharacterStats(character);
            data.Characters[characterShortCode].Stats = stats;
            
            var levelData = GetCharacterLevelData(character);
            data.Characters[characterShortCode].LevelData = levelData;
        }
        
        return data;
    }
}

function GetBasicPlayerData() {
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
        var data = entry.getData();
        
        return data;
    }
}

function GetPlayerCharacterData(characterId) {
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
        var data = entry.getData();
        //Player Character
        var character = data.Characters["Char_" + characterId.toString()];
        
        return character;
    }
}


function GetVirtualGoods() {
    var player = Spark.getPlayer();
    var vGoods = player.getVirtualGoods();
    var config = Spark.getConfig();
    
    var inventory = [];
    
    for (var key in vGoods) {
        if (vGoods.hasOwnProperty(key)) {
            var vGood = config.getVirtualGood(key);
            var item = {
                "ItemId": key,
                "Amount": vGoods[key],
                "Name": vGood.getName(),
                "Description": vGood.getDescription()
            }
            inventory.push(item);
        }
    }
    return inventory;
}

function UpdateTeam(teamId, slot1, slot2, slot3, slot4) {
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
        var data = entry.getData();
        
        var duplicateChar = false;
        var currentSlot = slot1;
        if(currentSlot == slot2 || currentSlot == slot3 || currentSlot == slot4) {
            duplicateChar = true;
        }
        currentSlot = slot2;
        if(currentSlot == slot3 || currentSlot == slot4) {
            duplicateChar = true;
        }
        currentSlot = slot3;
        if(currentSlot == slot4) {
            duplicateChar = true;
        }
        if(duplicateChar == true) {
            Spark.setScriptError("ERROR", {"error": "Cannot have duplicate characters on team"});
            Spark.exit();
        }
        
        data.Teams[teamId] = {
            "TeamId": teamId,
            "Members": [
                Number(slot1),
                Number(slot2),
                Number(slot3),
                Number(slot4)
            ],
            "Unlocked": true
        };
        
        //Persist and return any errors
        var entryStatus = entry.persistor().persist().error();
        
        //If there are errors the entry would not persist and we can act on that information
        if(entryStatus){
            //Output error script
            Spark.setScriptError("ERROR", entryStatus);
            //Stop execution of script
            Spark.exit();
        }
        
        return data.Teams[teamId];
    }
}