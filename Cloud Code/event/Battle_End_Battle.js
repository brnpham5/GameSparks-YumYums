// ====================================================================================================
//
// Cloud Code for Battle_End_Battle, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

require("Campaign_Module");
require("Player_Battle_Reward");
require("Player_Module");
require("Player_Energy_Module");

var nodeId = Spark.getData().NodeId;
var timeElapsed = Spark.getData().TimeElapsed;
var battleOrigin = Spark.getData().BattleOrigin;
var teamId = Spark.getData().TeamId;
var rank = Spark.getData().Rank;

var result;
switch(battleOrigin) {
    case "Campaign":
        result = ResolveCampaignBattle(nodeId, teamId);
        break;
        
    case "Daily":
        result = ResolveDailyBattle(nodeId);
        break;
        
    default:
        break;
}

Spark.setScriptData("Rewards", result.Rewards);
Spark.setScriptData("CampaignProgress", result.CampaignProgress);

function ResolveCampaignBattle(nodeId, teamId) {
    //Campaign_Module
    var potentialRewards = GetBattleRewardData(nodeId);
    
    //Player_Energy_Module
    if(UseEnergy(potentialRewards.EnergyCost, "Campaign Victory - " + nodeId)){
        //Player_Battle_Reward
        var progress = LogCampaignCompletion(nodeId, rank, timeElapsed);
        var rewards = GrantBattleRewards(potentialRewards, teamId);
        
        var result = {};
        result.Rewards = rewards;
        result.CampaignProgress = progress;
        return result;
    } else {
        Spark.setScriptError("ERROR", "Player does not have enough energy!");
        Spark.exit();
    }
}

function ResolveDailyBattle(battleId) {
    
}

