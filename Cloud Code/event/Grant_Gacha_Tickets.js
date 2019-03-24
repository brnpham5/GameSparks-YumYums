// ====================================================================================================
//
// Cloud Code for Grant_Gacha_Tickets, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

var value = Spark.getData().Value;
var amount = Spark.getData().Amount;


var player = Spark.getPlayer();

if(value == 1){
    player.addVGood("Gacha_Ticket_1", amount);
} else if(value == 2) {
    player.addVGood("Gacha_Ticket_2", amount);
}
