// ====================================================================================================
//
// Cloud Code for Player_Get_Character_Data, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Character_Calculate_Stats");
require("Player_Module");
require("Player_Character_GetLevelData");

var characterId = Spark.getData().CharacterId;

//Player_Module
var character = GetPlayerCharacterData(characterId);

//Player_Character_GetLevelData
var levelData = GetCharacterLevelData(character);
character.LevelData = levelData;

//Character Module
var stats = CalculateCharacterStats(character);

character.Stats = stats;

Spark.setScriptData("data", character);