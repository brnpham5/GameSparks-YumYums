// ====================================================================================================
//
// Cloud Code for Gacha_Pull_Module, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
require("Gacha_Module");

function PullFromPool(gachaType, gachaId){
    var gacha = GetGacha(gachaType, gachaId);
    var canAfford = CanAffordSingle(gacha);
    
    if(canAfford === true){
        var pool = RollPool(gacha);
        var subpool = RollSubpool(pool);
        var content = RollContent(subpool);
        AddItem(content.ShortCode, 1);
        var player = Spark.getPlayer();
        player.useVGood(gacha.ItemCost, 1, "Single Pull - " + gacha.Name);
        return content;
    } else {
        Spark.setScriptError("Error", "Player can not afford to pull from this gacha");
        Spark.exit();
    }
}

function TenfoldPullFromPool(gachaType, gachaId){
    var gacha = GetGacha(gachaType, gachaId);
    var canAfford = CanAffordTenfold(gacha);
    
    if(canAfford === true){
        var totalPull = [];
        for(var i = 0; i < 10; i++){
            var pool = RollPool(gacha);
            var subpool = RollSubpool(pool);
            var content = RollContent(subpool);
            AddItem(content.ShortCode, 1);
            
            totalPull.push(content);
        }
        
        var player = Spark.getPlayer();
        player.useVGood(gacha.ItemCost, 10, "Tenfold Pull - " + gacha.Name);
        return totalPull;
    } else {
        Spark.setScriptError("Error", "Player can not afford to pull from this gacha");
        Spark.exit();
    }
}

function CanAffordSingle(gacha){
    var itemCost = gacha.ItemCost;
    var player = Spark.getPlayer();
    var itemOwned = player.hasVGood(itemCost);
    if(itemOwned > 0){
        return true;
    } else {
        return false;
    }
}

function CanAffordTenfold(gacha){
    var itemCost = gacha.ItemCost;
    var player = Spark.getPlayer();
    var itemOwned = player.hasVGood(itemCost);
    if(itemOwned >= 10){
        return true;
    } else {
        return false;
    }
}

function RollPool(gacha){
    var totalWeight = 0;
    for(var i = 0 ; i < gacha.Pools.length; i++){
        totalWeight += gacha.Pools[i].Weight;
    }
    
    var roll = GetRndInteger(1, totalWeight);
    
    for(i = 0 ; i < gacha.Pools.length; i++){
        roll -= gacha.Pools[i].Weight;
        if(roll <= 0){
            return gacha.Pools[i];
        }
    }
}

function RollSubpool(pool){
    var totalWeight = 0;
    for(var i = 0 ; i < pool.Subpools.length; i++){
        totalWeight += pool.Subpools[i].Weight;
    }
    
    var roll = GetRndInteger(1, totalWeight);
    
    for(i = 0 ; i < pool.Subpools.length; i++){
        roll -= pool.Subpools[i].Weight;
        if(roll <= 0){
            return pool.Subpools[i];
        }
    }
}

function RollContent(subpool){
    var config = Spark.getConfig();
    var totalWeight = 0;
    for(var i = 0 ; i < subpool.Contents.length; i++){
        totalWeight += subpool.Contents[i].Weight;
    }
    
    var roll = GetRndInteger(1, totalWeight);
    
    for(i = 0 ; i < subpool.Contents.length; i++){
        roll -= subpool.Contents[i].Weight;
        if(roll <= 0){
            subpool.Contents[i].ItemData = config.getVirtualGood(subpool.Contents[i].ShortCode);
            return subpool.Contents[i];
        }
    }
}

function AddItem(itemShortCode, amount){
    var player = Spark.getPlayer();
    player.addVGood(itemShortCode, 1);
}

function GetRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}



