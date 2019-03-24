// ====================================================================================================
//
// Cloud Code for Player_Rank_Up_Character, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Character_Upgrade");
var characterId = Spark.getData().CharacterId;

var result = RankUpCharacter(characterId);

Spark.setScriptData("Result", result);