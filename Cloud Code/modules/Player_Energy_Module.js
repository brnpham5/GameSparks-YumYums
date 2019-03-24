// ====================================================================================================
//
// Cloud Code for Player_Energy_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
const MaxEnergyRegenAmount = 120;
const EnergyRefreshTime = 10;

function UseEnergy(amount, reason){
    var player = Spark.getPlayer();
    
    if(player.getBalance("Energy") >= amount){
        player.debit("Energy", amount, reason);
    
        if(player.getBalance("Energy") < MaxEnergyRegenAmount){
            StartRegeneratingEnergy();
        }
        
        return true;
    } else {
        return false;
    }
}

function GrantEnergy(amount, reason){
    var player = Spark.getPlayer();
    
    player.credit("Energy", amount, reason);
    
    if(player.getBalance("Energy") >= MaxEnergy){
        StopRegeneratingEnergy();
    }
}

function StartRegeneratingEnergy(){
    var player = Spark.getPlayer();
    var energyData = GetEnergyData();
    
    var timeStart = energyData.TimeStart;
    var timeStop = energyData.TimeStop;
    var elapsedTime = timeStop - timeStart;
    var remainingTime = EnergyRefreshTime - elapsedTime;
    
    if(remainingTime > EnergyRefreshTime || remainingTime <= 0){
        remainingTime = EnergyRefreshTime;
    }
    
    var scheduler = Spark.getScheduler();
    scheduler.inSeconds("Player_Energy_Regenerate", remainingTime, {}, "Energy-" + player.getPlayerId());
    SetTimeStart();
}

function StopRegeneratingEnergy(){
    var player = Spark.getPlayer();
    var scheduler = Spark.getScheduler();
    scheduler.cancel(player.getPlayerId() + "-energy");
    SetTimeStop();
}

function GetEnergyData(){
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
        var entryData = entry.getData();
        
        var energyData = entryData.EnergyData;
        
        return energyData;
    }
}

function SetTimeStart(){
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
        var entryData = entry.getData();
        
        entryData.EnergyData.TimeStart = Math.floor(new Date().getTime() / 1000);
        entryData.EnergyData.Active = true;
        
        //Persist and return any errors
        var entryStatus = entry.persistor().persist().error();
        
        //If there are errors the entry would not persist and we can act on that information
        if(entryStatus){
            //Output error script
            Spark.setScriptError("ERROR", entryStatus);
            //Stop execution of script
            Spark.exit();
        }
        
        return entryData.EnergyData;
    }
}

function SetTimeStop(){
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
        var entryData = entry.getData();
        
        entryData.EnergyData.TimeStop = Math.floor(new Date().getTime() / 1000);
        entryData.EnergyData.Active = false;
        
        var elapsedTime = (Math.floor(new Date().getTime() / 1000)) - entryData.EnergyData.TimeStart;
        var remainingTime = EnergyRefreshTime - elapsedTime;
        if(remainingTime <= 0){
            remainingTime = EnergyRefreshTime;
        }
        
        entryData.EnergyData.RemainingTime = remainingTime;
        
        //Persist and return any errors
        var entryStatus = entry.persistor().persist().error();
        
        //If there are errors the entry would not persist and we can act on that information
        if(entryStatus){
            //Output error script
            Spark.setScriptError("ERROR", entryStatus);
            //Stop execution of script
            Spark.exit();
        }
        
        return entryData.EnergyData;
    }
}



