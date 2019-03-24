// ====================================================================================================
//
// Cloud Code for Player_Upgrade_Character, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Character_Upgrade");
var characterId = Spark.getData().CharacterId;
var upgradeType = Spark.getData().Type;

//Player_Module
var result = UpgradeCharacter(characterId, upgradeType);

Spark.setScriptData("Result", result);