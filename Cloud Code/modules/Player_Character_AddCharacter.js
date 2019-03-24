// ====================================================================================================
//
// Cloud Code for Player_Character_AddCharacter, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

if (typeof GetCharacterBaseData !== "function") {
    require("Character_Module");
}

if (typeof GetCharacterLevelData !== "function") {
    require("Player_Character_GetLevelData");
}

function AddCharacter(characterId) {
    var player = Spark.getPlayer();
    var playerId = player.getPlayerId();
    
    var config = Spark.getConfig();
    
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
        
        var characterBase = GetCharacterBaseData(characterId);
        
        var character = {};
        if(data.Characters["Char_" + characterId.toString()] == null) {
            character = {
                "Name": characterBase.Base.Name,
                "Rank": 1,
                "Rarity": characterBase.Base.Rarity,
                "Experience": 0,
                "Model": characterBase.Base.Model,
                "Special": characterBase.Special.Name,
                "Owned": true,
                "Level": 1,
                "CharacterId": characterBase.Base.CharacterId,
                "Upgrades": {
                    "Health": 0,
                    "Special": 0,
                    "Power": 0
                }
            };
            
            character.LevelData = GetCharacterLevelData(character);
            data.Characters["Char_" + characterId] = character;
        } else {
            Spark.setScriptError("ERROR", {"error": "Player already owns character"});
            Spark.exit();
        }
        
        //Persist and return any errors
        var entryStatus = entry.persistor().persist().error();
        
        //If there are errors the entry would not persist and we can act on that information
        if(entryStatus){
            //Output error script
            Spark.setScriptError("ERROR", entryStatus);
            //Stop execution of script
            Spark.exit();
        }
    }
}