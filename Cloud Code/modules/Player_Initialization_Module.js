// ====================================================================================================
//
// Cloud Code for Player_Initialization_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Player_Module");
require("Player_Character_AddCharacter");

function InitializeData() {
    //Create entry and get its data object
    var API = Spark.getGameDataService();
    
    //Create entry, data is best accessed via ID
    //Making the entryID as Spark.getPlayer().playerId is usually the best approach
    var playerId = Spark.getPlayer().getPlayerId();
    
    var entry = API.createItem("PlayerData", playerId);
    
    //Get the data object where custom data is stored
    var data = entry.getData();

    var presetTeam0 = [];
    presetTeam0.push(0);
    presetTeam0.push(0);
    presetTeam0.push(0);
    presetTeam0.push(0);

    var presetTeam1 = [];
    presetTeam1.push(1);
    presetTeam1.push(2);
    presetTeam1.push(3);
    presetTeam1.push(4);
    
    var presetTeam2 = [];
    presetTeam2.push(5);
    presetTeam2.push(6);
    presetTeam2.push(7);
    presetTeam2.push(8);
    
    var presetTeam3 = [];
    presetTeam3.push(9);
    presetTeam3.push(10);
    presetTeam3.push(11);
    presetTeam3.push(8);

    data.Level = 1;
    data.Experience = 0;
    data.Teams = [
        {
            "TeamId": 0,
            "Members": presetTeam0,
            "Unlocked": false
        },{
            "TeamId": 1,
            "Members": presetTeam1,
            "Unlocked": true
        },{
            "TeamId": 2,
            "Members": presetTeam2,
            "Unlocked": true
        },{
            "TeamId": 3,
            "Members": presetTeam3,
            "Unlocked": true
        },{
            "TeamId": 4,
            "Members": presetTeam0,
            "Unlocked": false
        },{
            "TeamId": 5,
            "Members": presetTeam0,
            "Unlocked": false
        }
    ];
    
    data.Characters = {};
    data.CampaignProgress = [
        {
            "NodeId": 0,
            "Rank": 3,
            "BestTime": 0
        }
    ];
    
    data.ItemStoreInventory = {
        "Contents": [],
        "ExpireTime": "2019-03-14T22:32:22.462Z"
    };
    
    data.EnergyData = {
        "TimeStart": Math.floor(new Date().getTime() / 1000),
        "TimeStop": Math.floor(new Date().getTime() / 1000),
        "Active": false,
        "RemainingTime": 300
    };
    
    //Persist and return any errors
    var entryStatus = entry.persistor().persist().error();
    
    //If there are errors the entry would not persist and we can act on that information
    if(entryStatus){
        //Output error script
        Spark.setScriptError("ERROR", entryStatus);
        //Stop execution of script
        Spark.exit();
    }
    
    //Starting Characters
    AddCharacter(0);
    AddCharacter(1);
    
    //Temp Addition
    AddCharacter(2);
    AddCharacter(3);
    AddCharacter(4);
    AddCharacter(5);
    AddCharacter(6);
    AddCharacter(7);
    AddCharacter(8);
    AddCharacter(9);
    AddCharacter(10);
    AddCharacter(11);
    
}
