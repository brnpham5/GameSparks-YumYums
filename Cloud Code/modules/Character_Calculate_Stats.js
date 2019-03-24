// ====================================================================================================
//
// Cloud Code for Character_Calculate_Stats, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

//MetaData_Module
if (typeof characterMetaData === 'undefined' || characterMetaData === null ) {
    require("MetaData_Module");
    var characterMetaData = GetCharacterMetaData();
}

//Character_Module
if (typeof GetCharacterBaseData !== "function" || typeof GetCharacterLevelTable !== "function") {
    require("Character_Module");
}

function CalculateCharacterStats(characterData) {
    var characterId = characterData.CharacterId;
    var characterBaseData = GetCharacterBaseData(characterId);
    var levelTable = GetCharacterLevelTable(characterId);
        
    var upgradeData = characterBaseData.UpgradeData;
        
    var rarityData = characterMetaData.Rarities["Rarity_" + characterBaseData.Base.Rarity];
    var rankData = rarityData["Rank_" + characterData.Rank];
    var rankStatBoost = rankData["StatBoost"];
        
    var baseHealth = levelTable.Table[characterData.Level].Health;
    var healthFromUpgrades = CalculateStatsFromUpgrade(upgradeData, characterData.Upgrades.Health, "Health");
        
    var health = baseHealth + healthFromUpgrades;
    var healthFromRank = Math.ceil(health * (rankStatBoost / 100));
    characterBaseData.Base.Health = health + healthFromRank;
        
    var basePower = levelTable.Table[characterData.Level].Power;
    var powerFromUpgrades = CalculateStatsFromUpgrade(upgradeData, characterData.Upgrades.Power, "Power");
        
    var power = basePower + powerFromUpgrades;
    var powerFromRank = Math.ceil(power * (rankStatBoost / 100));
    characterBaseData.Base.Power = power + powerFromRank;
        
    characterBaseData.Base.Special = characterBaseData.Special;
    characterBaseData.Base.Rank = characterData.Rank;
        
    var stats = characterBaseData.Base;
        
    return stats;
}

function CalculateStatsFromUpgrade(upgradeData, upgradeAmount, upgradeType) {
    var commonMax = characterMetaData.Upgrades.Common.MaximumLevel;
    var commonCount = characterMetaData.Upgrades.Common.Count;
    var rareMax = characterMetaData.Upgrades.Rare.MaximumLevel;
    var rareCount = characterMetaData.Upgrades.Rare.Count;
    var epicMax = characterMetaData.Upgrades.Epic.MaximumLevel;
    var epicCount = characterMetaData.Upgrades.Epic.Count;
    var legendaryMax = characterMetaData.Upgrades.Legendary.MaximumLevel;
    var legendaryCount = characterMetaData.Upgrades.Legendary.Count;
    
    var totalStatBoost = 0;
    
    if(upgradeAmount < commonMax) {
        totalStatBoost += upgradeAmount * upgradeData["Upgrade_1"][upgradeType];
    } else if (upgradeAmount <= rareMax) {
        totalStatBoost += commonCount * upgradeData["Upgrade_1"][upgradeType];
        upgradeAmount -= commonCount;
        totalStatBoost += upgradeAmount * upgradeData["Upgrade_2"][upgradeType];
    } else if (upgradeAmount <= epicMax) {
        totalStatBoost += commonCount * upgradeData["Upgrade_1"][upgradeType];
        upgradeAmount -= commonCount;
        totalStatBoost += rareCount * upgradeData["Upgrade_2"][upgradeType];
        upgradeAmount -= rareCount;
        totalStatBoost += upgradeAmount * upgradeData["Upgrade_3"][upgradeType];
    } else if (upgradeAmount <= legendaryMax) {
        totalStatBoost += commonCount * upgradeData["Upgrade_1"][upgradeType];
        upgradeAmount -= commonCount;
        totalStatBoost += rareCount * upgradeData["Upgrade_2"][upgradeType];
        upgradeAmount -= rareCount;
        totalStatBoost += epicCount * upgradeData["Upgrade_3"][upgradeType];
        upgradeAmount -= epicCount;
        totalStatBoost += upgradeAmount * upgradeData["Upgrade_4"][upgradeType];
    }

    return totalStatBoost;
}