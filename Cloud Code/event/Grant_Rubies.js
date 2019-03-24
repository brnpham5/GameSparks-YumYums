// ====================================================================================================
//
// Cloud Code for Grant_Rubies, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

var amount = Spark.getData().Amount;
var player = Spark.getPlayer();

player.debit("Rubies", amount, "Granting for testing");