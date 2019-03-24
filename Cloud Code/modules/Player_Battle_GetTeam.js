// ====================================================================================================
//
// Cloud Code for Player_Battle_GetTeam, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Character_Calculate_Stats");

function GetTeamData(teamId) {
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
        
        var teamData = data.Teams[teamId];
        
        var char1 = data.Characters["Char_" + teamData.Members[0]];
        var char2 = data.Characters["Char_" + teamData.Members[1]];
        var char3 = data.Characters["Char_" + teamData.Members[2]];
        var char4 = data.Characters["Char_" + teamData.Members[3]];
        
        var result = [];
        result.TeamId = teamId;
        //Character_Module
        result.push(CalculateCharacterStats(char1));
        result.push(CalculateCharacterStats(char2));
        result.push(CalculateCharacterStats(char3));
        result.push(CalculateCharacterStats(char4));
        result.Unlocked = teamData.Unlocked;
        
        return result;
    }
}