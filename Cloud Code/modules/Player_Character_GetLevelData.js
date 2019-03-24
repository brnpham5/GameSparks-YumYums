// ====================================================================================================
//
// Cloud Code for Player_Character_GetLevelData, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

if (typeof characterMetaData === 'undefined' || characterMetaData  === null) {
    require("MetaData_Module");
    var characterMetaData  = GetCharacterMetaData();
}

if (typeof GetCharacterBaseData !== "function") {
    require("Character_Module");
}

function GetCharacterLevelData(characterData) {
    var expTable = characterMetaData.Levels;
        
    var characterId = characterData.CharacterId;
    var currentRank = characterData.Rank;
            
    //Character_Module
    var characterBaseData = GetCharacterBaseData(characterId);
    var rarity = characterBaseData.Base.Rarity;
    var tag1 = characterBaseData.Base.Tag1;
    var tag2 = characterBaseData.Base.Tag2;
    
    //Get Level Up Data
    var maxLevel = characterMetaData.MaxLevel;
    var currentLevel = characterData.Level;
    
    if(currentLevel == maxLevel) {
        var expToNextLevel = 0;
    } else {
        var expToNextLevel = expTable[currentLevel + 1].Experience;
    }
            
    //Get Rarity Data
    var rarityData = characterMetaData.Rarities["Rarity_" + rarity];
            
    //Get Rank Up Data
    var maxRank = characterMetaData.MaxRank;
    
    if(characterData.Rank == maxRank) {
        var shardData = {
            "ShardCost": 0,
            "MoneyCost": 0
        }
    } else {
        var shardData = rarityData["Rank_" + (currentRank + 1).toString()];
    }
            
    //Get Upgrade Data
    var upgradeData = rarityData["Upgrades"];
    var maxUpgrade = characterMetaData.MaxUpgrade;
    
    if(characterData.Upgrades.Health == maxUpgrade){
        healthUpgradeCost = 0;
        healthMoneyCost = 0;
        healthItem1 = "Max";
        healthItem2 = "Max";
    } else {
        var healthUpgradeCost = upgradeData[characterData.Upgrades.Health + 1];
        var healthMoneyCost = healthUpgradeCost.MoneyCost;
        var healthItemRarity = healthUpgradeCost.ItemRarity;
        var healthItemAmount = healthUpgradeCost.ItemAmount;
        
        var healthItem1 = GetUpgradeItemShortCode(tag1, healthItemRarity);
        var healthItem2 = GetUpgradeItemShortCode(tag2, healthItemRarity);
    }
    
    if(characterData.Upgrades.Power == maxUpgrade) {
        powerUpgradeCost = 0;
        powerMoneyCost = 0;
        powerItem1 = "Max";
        powerItem2 = "Max";
    } else {
        var powerUpgradeCost = upgradeData[characterData.Upgrades.Power + 1];
        var powerMoneyCost = powerUpgradeCost.MoneyCost;
        var powerItemRarity = powerUpgradeCost.ItemRarity;
        var powerItemAmount = powerUpgradeCost.ItemAmount;
        
        var powerItem1 = GetUpgradeItemShortCode(tag1, powerItemRarity);
        var powerItem2 = GetUpgradeItemShortCode(tag2, powerItemRarity);
    }
    
    var LevelData = {
        "MaxRank": maxRank,
        "Rank": {
            "ShardCost": shardData.ShardCost,
            "MoneyCost": shardData.MoneyCost,
        },
        "MaxLevel": maxLevel,
        "Level": {
            "ExpToNextLevel": expToNextLevel,
            "MaxLevel": maxLevel
        },
        "MaxUpgrade": maxUpgrade,
        "UpgradeHealth": {
            "MoneyCost": healthMoneyCost,
            "Ingredient1": healthItem1,
            "Ingredient2": healthItem2,
            "Amount": healthItemAmount
        },
        "UpgradePower": {
            "MoneyCost": powerMoneyCost,
            "Ingredient1": powerItem1,
            "Ingredient2": powerItem2,
            "Amount": powerItemAmount
        }
    };
    return LevelData;
}

function GetUpgradeItemShortCode(tag, rarity) {
    var itemShortCode = characterMetaData.Configs.Tags[tag].Name;
    itemShortCode = itemShortCode.concat("_" + rarity);
    
    return itemShortCode;
}