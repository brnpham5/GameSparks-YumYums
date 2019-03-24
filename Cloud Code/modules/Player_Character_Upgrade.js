// ====================================================================================================
//
// Cloud Code for Player_Character_Upgrade, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

//MetaData_Module
if (typeof characterMetaData === 'undefined' || characterMetaData === null) {
    require("MetaData_Module");
    var characterMetaData = GetCharacterMetaData();
}

if (typeof GetCharacterBaseData !== "function") {
    require("Character_Module");
}

if (typeof CalculateCharacterStats !== "function") {
    require("Character_Calculate_Stats");
}

function RankUpCharacter(characterId){
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    var logger = Spark.getLog();
    
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
        
        var character = data.Characters["Char_" + characterId];
        var currentRank = character.Rank;
        
        //Check if character is not max rank
        if(currentRank < characterMetaData.MaxRank) {
            var canRankUp = true;
            var shardId = ("Shard_" + characterId);
            
            //Character_Module
            var characterBaseData = GetCharacterBaseData(characterId);
            var rarity = characterBaseData.Base.Rarity;
        
            var shardData = characterMetaData.Rarities["Rarity_" + rarity];
            var cost = shardData["Rank_" + (currentRank + 1).toString()];
            
            //Check if player has enough shards to rank up
            var currentShards = player.hasVGood(shardId);
            if(currentShards < cost.ShardCost) {
                canRankUp = false;
                Spark.setScriptError("ERROR", "Not enough shards: " + currentShards + " " + cost.ShardCost);
                Spark.exit();
                //logger.warn("Modified Client Warning. Player: " + player.getPlayerId() + " has attempted to rank up a character despite not having enough shards");
            }
            
            //Check if player has enough money to rank up
            var currentMoney = player.getBalance("Money");
            if(currentMoney < cost.MoneyCost) {
                canRankUp = false;
                Spark.setScriptError("ERROR", "Not enough money: " + currentMoney + " " + cost.MoneyCost);
                Spark.exit();
                //logger.warn("Modified Client Warning. Player: " + player.getPlayerId() + " has attempted to rank up a character despite not having enough money");
            }
            
            //If everything is good, rank up character
            if(canRankUp === true) {
                var result = {};
                result.UsedItems = [];
                //Deduct shards and money
                player.useVGood(shardId, cost.ShardCost, "Ranking up " + character.Name);
                result.UsedItems.push({
                    "ItemId": (shardId),
                    "Amount": player.hasVGood(shardId)
                });
                
                player.debit("Money", cost.MoneyCost, "Ranking up " + character.Name);
                result.Money = player.getBalance("Money");
                
                character.Rank += 1;
                data.Characters["Char_" + characterId] = character;
                character.Stats = CalculateCharacterStats(character);
                result.Character = character;
                
                //Persist and return any errors
                var entryStatus = entry.persistor().persist().error();
                
                //If there are errors the entry would not persist and we can act on that information
                if(entryStatus){
                    //Output error script
                    Spark.setScriptError("ERROR", entryStatus);
                    //Stop execution of script
                    Spark.exit();
                }
                
                return result;
            }
        } else {
            Spark.setScriptError("ERROR", "Character is already max rank");
            //Stop execution of script
            Spark.exit();
        }
    }
}

function UpgradeCharacter(characterId, upgradeType){
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    var logger = Spark.getLog();
    
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
        
        var character = data.Characters["Char_" + characterId];
        
        var upgradeName = characterMetaData.Configs.UpgradeTypes[upgradeType].Name;
        var currentUpgrade = character.Upgrades[upgradeName];
        
        //Check if character is not already at the max upgrade
        if(currentUpgrade < characterMetaData.MaxUpgrade) {
            //Character_Module
            var characterBaseData = GetCharacterBaseData(characterId);
            var tag1 = characterBaseData.Base.Tag1;
            var tag2 = characterBaseData.Base.Tag2;
            var rarity = characterBaseData.Base.Rarity;
            
            var canUpgrade = true;
            var upgradeData = characterMetaData.Rarities["Rarity_" + rarity];
            var cost = upgradeData.Upgrades[currentUpgrade + 1];
            
            //Check if player has enough money to rank up
            var currentMoney = player.getBalance("Money");
            if(currentMoney < cost.MoneyCost) {
                canUpgrade = false;
                Spark.setScriptError("ERROR", "Not enough money: " + currentMoney + " " + cost.MoneyCost);
                //logger.warn("Modified Client Warning. Player: " + player.getPlayerId() + " has attempted to rank up a character despite not having enough money");
                Spark.exit();
            }
            
            var itemRarity = cost.ItemRarity;
            var itemAmount = cost.ItemAmount;
            
            var item1 = GetUpgradeItemShortCode(tag1, itemRarity);
            var item2 = GetUpgradeItemShortCode(tag2, itemRarity);
            //if tags are the same, cost is just one ingredient, but double the amount
            if(tag1 === tag2) {
                var currentCost = itemAmount * 2;
                var currentIngredients = player.hasVGood(item1);
                if(currentIngredients < currentCost) {
                    canUpgrade = false;
                    Spark.setScriptError("ERROR", "Not enough ingredient: " + item1 + " " + currentCost);
                    Spark.exit();
                }
            } else {
                //if tags are different, then cost is normal for both
                var currentCost = itemAmount;
                var currentIngredientAmount1 = player.hasVGood(item1);
                var currentIngredientAmount2 = player.hasVGood(item2);
                
                if(currentIngredientAmount1 < currentCost || currentIngredientAmount2 < currentCost) {
                    canUpgrade = false;
                    Spark.setScriptError("ERROR", "Not enough ingredient: " + item1 + " " + currentCost);
                    Spark.setScriptError("ERROR2", "Not enough ingredient: " + item2 + " " + currentCost);
                    Spark.exit();
                }
            }
            
            //If everything is good, rank up character
            if(canUpgrade === true) {
                var result = {};
                result.UsedItems = [];
                
                //Deduct shards
                player.useVGood(item1, itemAmount, "Upgrading " + character.Name);
                if(tag1 !== tag2) {
                    result.UsedItems.push({
                        "ItemId": item1,
                        "Amount": player.hasVGood(item1)
                    });
                }
                
                player.useVGood(item2, itemAmount, "Upgrading " + character.Name);
                
                result.UsedItems.push({
                    "ItemId": item2,
                    "Amount": player.hasVGood(item2)
                })
                
                //Deduct money
                player.debit("Money", cost.MoneyCost, "Upgrading " + character.Name);
                result.Money = player.getBalance("Money");
                
                character.Upgrades[upgradeName] = currentUpgrade + 1;
                data.Characters["Char_" + characterId] = character;
                character.Stats = CalculateCharacterStats(character);
                result.Character = character;
                
                //Persist and return any errors
                var entryStatus = entry.persistor().persist().error();
                
                //If there are errors the entry would not persist and we can act on that information
                if(entryStatus){
                    //Output error script
                    Spark.setScriptError("ERROR", entryStatus);
                    //Stop execution of script
                    Spark.exit();
                }
                
                return result;
            }
        } else {
            Spark.setScriptError("ERROR", "Failed to upgrade character. Character is already max rank");
            //Stop execution of script
            Spark.exit();
        }
    }
}

function GetUpgradeItemShortCode(tag, rarity) {
    var itemShortCode = characterMetaData.Configs.Tags[tag].Name;
    itemShortCode = itemShortCode.concat("_" + rarity);
    
    return itemShortCode;
}