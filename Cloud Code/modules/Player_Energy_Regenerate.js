// ====================================================================================================
//
// Cloud Code for Player_Energy_Regenerate, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

const MaxEnergyRegenAmount = 120;

var player = Spark.getPlayer();

if(player.getBalance("Energy") < MaxEnergyRegenAmount){
    player.credit("Energy", 1, "Regular regeneration");
    scheduler.inSeconds("Player_Energy_Regenerate", 5, {}, "Energy-" + player.getPlayerId());
}