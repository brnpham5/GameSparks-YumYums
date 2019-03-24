// ====================================================================================================
//
// Cloud Code for Campaign_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
require("Character_Module");
require("Character_Calculate_Stats");

function GetNodeData(nodeId) {
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("Campaign", nodeId);
    
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

function GetBattleRewardData(nodeId) {
    var nodeData = GetNodeData(nodeId);
    
    var rewards = nodeData.Rewards;
    
    var result = {
        "Money" : rewards.Money,
        "Experience": rewards.Experience,
        "Ingredients": rewards.Ingredients,
        "Shards": rewards.Shards,
        "EnergyCost": 10
    }
    
    return result;
}

function GetEnemyData(nodeId) {
    var data = GetNodeData(nodeId);
    
    var enemies = data.Enemies;
    
    var result = [];
    for(var i = 0; i < enemies.length; i++) {
        result.push(GetEnemyCharacterData(enemies[i]));
    }
    
    return result;
}

function ParseEnemies(nodeData) {
    var enemies = nodeData.Enemies;
    
    var result = [];
    for(var i = 0; i < enemies.length; i++) {
        var characterBase = GetCharacterBaseData(enemies[i].CharacterId);
        character = {
            "Name": characterBase.Base.Name,
            "Rank": 1,
            "Rarity": characterBase.Base.Rarity,
            "Experience": 0,
            "Model": characterBase.Base.Model,
            "Special": characterBase.Special.Name,
            "Level": enemies[i].Level,
            "CharacterId": characterBase.Base.CharacterId,
            "Upgrades": enemies[i].Upgrades
        };
        result.push(GetEnemyCharacterData(character));
    }
    
    return result;
}

function GetEnemyCharacterData(characterData) {
    if(characterData.CharacterId == 0) {
        return {};
    }
    //Character Module
    var stats = CalculateCharacterStats(characterData);
    
    return stats;
}

