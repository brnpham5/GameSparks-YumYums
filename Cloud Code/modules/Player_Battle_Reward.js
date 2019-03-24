// ====================================================================================================
//
// Cloud Code for Player_Battle_Reward, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================


//MetaData_Module
if (typeof characterMetaData === 'undefined' || characterMetaData === null || typeof playerMetaData === 'undefined' || playerMetaData === null) {
    require("MetaData_Module");
    var characterMetaData = GetCharacterMetaData();
    var playerMetaData = GetPlayerMetaData();
}

function GrantBattleRewards(battleRewards, teamId) {
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    
    //Load API and get entry
    var API = Spark.getGameDataService();
    
    //Attempt to get entry
    var entryObject = API.getItem("PlayerData", playerId);
    
    //Get Config
    var config = Spark.getConfig();
    
    //If error attempting to retrieve entry
    if(entryObject.error()){
        Spark.setScriptError("ERROR", entryObject.error())
        Spark.exit();
    } else {
        //Get entry
        var entry = entryObject.document();
        //Access Data
        var data = entry.getData();
        
        var experience = battleRewards.Experience;
        var money = battleRewards.Money;
        var ingredients = battleRewards.Ingredients;
        var shards = battleRewards.Shards;
        var team = battleRewards.Team;
        
        var rewardedMoney = money;
        var rewardedExperience = experience;
        var rewardedItems = [];
        
        var playerLevelUps = AddPlayerExperience(data, rewardedExperience);
        var playerTeam = data.Teams[teamId];
        var characterLevelUps = [];
        var levelData;
        characterLevelUps.push(AddCharacterExperience(data, playerTeam.Members[0], rewardedExperience));
        characterLevelUps.push(AddCharacterExperience(data, playerTeam.Members[1], rewardedExperience));
        characterLevelUps.push(AddCharacterExperience(data, playerTeam.Members[2], rewardedExperience));
        characterLevelUps.push(AddCharacterExperience(data, playerTeam.Members[3], rewardedExperience));
        
        player.credit("Money", rewardedMoney, "Victory!");
        
        
        for(var i = 0; i < ingredients.length; i++) {
            var roll = GetRandomInteger(1, 100);
            var ingredient = ingredients[i];
            if(roll <= ingredient.Chance) {
                player.addVGood(ingredient.IngredientId, ingredient.Amount);
                var vGood = config.getVirtualGood(ingredient.IngredientId);
                rewardedItems.push({
                    "ItemId" : ingredient.IngredientId,
                    "Name": vGood.getName(),
                    "Description": vGood.getDescription(),
                    "Amount": ingredient.Amount,
                    "Owned": player.hasVGood(ingredient.IngredientId),
                });
            }
        }
        
        for(var i = 0; i < shards.length; i++) {
            var roll = GetRandomInteger(1, 100);
            var shard = shards[i];
            if(roll <= shard.Chance) {
                player.addVGood(shard.ShardId, shard.Amount);
                var vGood = config.getVirtualGood(shard.ShardId);
                rewardedItems.push({
                    "ItemId" : shard.ShardId,
                    "Name": vGood.getName(),
                    "Description": vGood.getDescription(),
                    "Amount": shard.Amount,
                    "Owned": player.hasVGood(shard.ShardId),
                });
            }
        }
        
        //Persist and return any errors
        var status = entry.persistor().persist().error();

        //If there are errors the entry would not persist and we can act on that information
        if(status){
        //Output error script
            Spark.setScriptError("ERROR", status);
            //Stop execution of script
            Spark.exit();
        }
        
        var rewards = {
            "Experience": rewardedExperience,
            "Money": rewardedMoney,
            "OwnedMoney": player.getBalance("Money"),
            "Items": rewardedItems,
            "CharacterLevelUps": characterLevelUps,
            "PlayerLevelUps": playerLevelUps
        }
        
        return rewards;
    }
}

function LogCampaignCompletion(nodeId, rank, timeElapsed) {
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
        
        var rankRewards = 0;
        
        if(data.CampaignProgress[nodeId] == null) {
            //First time completion
            data.CampaignProgress[nodeId] = {
                "NodeId": Number(nodeId),
                "Rank": Number(rank),
                "BestTime": Number(timeElapsed)
            };
        } else {
            if(data.CampaignProgress[nodeId].Rank < rank) {
                rankRewards = rank - data.CampaignProgress[nodeId].Rank;
                data.CampaignProgress[nodeId].Rank = rank;
            }
            if(data.CampaignProgress[nodeId].BestTime > timeElapsed) {
                data.CampaignProgress[nodeId].BestTime = timeElapsed;
            }
        }
        
        //Persist and return any errors
        var status = entry.persistor().persist().error();

        //If there are errors the entry would not persist and we can act on that information
        if(status){
        //Output error script
            Spark.setScriptError("ERROR", status);
            //Stop execution of script
            Spark.exit();
        }
        
        return data.CampaignProgress[nodeId];
    }
}

function AddPlayerExperience(playerData, experienceAmount) {
    var maxLevel = playerMetaData.MaxLevel;
    var expTable = playerMetaData.Levels;
        
    var previousLevel = playerData.Level;
    var previousExperience = playerData.Experience;
    var nextLevel = playerData.Level + 1;
    var nextExperience = playerData.Experience + experienceAmount;
            
    var levelUps = 0;
    if(nextLevel >= maxLevel){
        var levelData = {
            "PreviousLevel": maxLevel,
            "PreviousExp": previousExperience,
            "NextExp": previousExperience,
            "ExpToNextLevel": 0,
            "LevelUps": 0
        };
    } else {
        while(nextLevel <= maxLevel && expTable[nextLevel].Experience !== null && nextExperience >= expTable[nextLevel].Experience) {
            //level up
            levelUps += 1;
            nextLevel += 1;
        }
            
        var expToNextLevel = expTable[nextLevel].Experience;
        playerData.Level += levelUps;
        playerData.Experience = nextExperience;
            
        var levelData = {
            "PreviousLevel": previousLevel,
            "PreviousExp": previousExperience,
            "NextExp": nextExperience,
            "ExpToNextLevel": expToNextLevel,
            "LevelUps": levelUps
        };
    }
    
    return levelData;
}

function AddCharacterExperience(playerData, characterId, experienceAmount) {
    if(characterId === 0) {
        return;
    }
    
    var maxLevel = characterMetaData.MaxLevel;
    var expTable = characterMetaData.Levels;
    
    var characterShortCode = "Char_" + characterId.toString();
    var character = playerData.Characters[characterShortCode];
            
    var previousLevel = character.Level;
    var previousExperience = character.Experience;
    var nextLevel = character.Level + 1;
    var nextExperience = character.Experience + experienceAmount;
        
    var levelUps = 0;
    if(nextLevel >= maxLevel) {
        var levelData = {
            "CharacterId": character.CharacterId,
            "PreviousLevel": previousLevel,
            "PreviousExp": previousExperience,
            "NextExp": previousExperience,
            "ExpToNextLevel": 0,
            "Rank": character.Rank,
            "LevelUps": 0
        }
    } else {
        while(nextLevel <= maxLevel && expTable[nextLevel].Experience !== null && nextExperience >= expTable[nextLevel].Experience) {
            //level up
            levelUps += 1;
            nextLevel += 1;
        }
            
        var expToNextLevel = expTable[nextLevel].Experience;
        playerData.Characters[characterShortCode].Level += levelUps;
        playerData.Characters[characterShortCode].Experience = nextExperience;
            
        var levelData = {
            "CharacterId": character.CharacterId,
            "PreviousLevel": previousLevel,
            "PreviousExp": previousExperience,
            "NextExp": nextExperience,
            "ExpToNextLevel": expToNextLevel,
            "Rank": character.Rank,
            "LevelUps": levelUps
        }
    }
        
    return levelData;
}

function AddRankRewards(data, rank) {
    
}

function GetShardData(shardId) {
    var config = Spark.getConfig();
    var shortCode = shardId;
    var vGood = config.getVirtualGood(shortCode);
    var name = vGood.getName();
    var description = vGood.getDescription();
    return {
        "Name": name,
        "Description": description
    };
}

function GetRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}