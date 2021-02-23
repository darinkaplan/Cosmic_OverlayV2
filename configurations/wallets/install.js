const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompts = require('prompts');
const overlay_config = require('../overlay_config.json');
const node_config = require('../node_config.json');

module.exports ={
  newnode: async function install(){
    try{
      console.log('\x1b[35m','Node Configuration:');
      var nodecfg = 'sudo cat /root/.origintrail_noderc'
      var nodecfg = await exec(nodecfg);
      console.log('\x1b[32m',nodecfg.stdout);


      if (fs.existsSync(__dirname+'/ethereum.json')){
        console.log('\x1b[35m','Ethereum Wallet Configuration:');
        var eth = 'sudo cat /root/wallets/ethereum.json'
        var eth = await exec(eth);

        console.log('\x1b[32m',eth.stdout);
        ethereum = '-v /root/wallets/ethereum.json:/ot-node/data/wallets/ethereum.json '
        ethereum_warn = 'You are restoring to the Ethereum blockchain.'
      }else{
        ethereum = ''
        ethereum_warn = ''
      }

      if(fs.existsSync(__dirname+'/starfleet.json')){
        console.log('\x1b[35m','Starfleet Wallet Configuration:');
        var sfc = 'sudo cat /root/wallets/starfleet.json'
        var sfc = await exec(sfc);

        console.log('\x1b[32m',sfc.stdout);
        starfleet = '-v /root/wallets/starfleet.json:/ot-node/data/wallets/starfleet.json '
        starfleet_warn = 'You are restoring to the Stafleet blockchain.'
      }else{
        starfleet = ''
        starfleet_warn = ''
      }

      if(fs.existsSync(__dirname+'/xDai.json')){
        console.log('\x1b[35m','xDai Wallet Configuration:');
        var xD = 'sudo cat /root/wallets/xDai.json'
        var xD = await exec(xD);

        console.log('\x1b[32m',xD.stdout);
        xDai = '-v /root/wallets/xDai.json:/ot-node/data/wallets/xDai.json '
        xDai_warn = 'You are restoring to the xDai blockchain.'
      }else{
        xDai = ''
        xDai_warn = ''
      }

      if(fs.existsSync(__dirname+'/rinkeby.json')){
        console.log('\x1b[35m','Rinkeby Wallet Configuration:');
        var rink = 'sudo cat /root/wallets/rinkeby.json'
        var rink = await exec(rink);

        console.log('\x1b[32m',rink.stdout);
        rinkeby = '-v /root/wallets/rinkeby.json:/ot-node/data/wallets/rinkeby.json '
        rinkeby_warn = 'You are restoring to the Rinkeby blockchain.'
      }else{
        rinkeby = ''
        rinkeby_warn = ''
      }

      if(fs.existsSync(__dirname+'/kovan.json')){
        console.log('\x1b[35m','Kovan Wallet Configuration:');
        var kov = 'sudo cat /root/wallets/kovan.json'
        var kov = await exec(kov);

        console.log('\x1b[32m',kov.stdout);
        kovan = '-v /root/wallets/kovan.json:/ot-node/data/wallets/kovan.json '
        kovan_warn = 'You are restoring to the Kovan blockchain.'
      }else{
        kovan = ''
        kovan_warn = ''
      }

      if(overlay_config.environment == 'development'){
        var install = 'sudo docker run --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+kovan+rinkeby+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }else if(overlay_config.environment == 'testnet'){
        //var install = 'sudo docker run --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+kovan+rinkeby+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }else{
        //var install = 'sudo docker run --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+ethereum+starfleet+xDai+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }

      console.log('\x1b[33m',"You are about to install your OriginTrail node onto the "+overlay_config.environment+" environment.");
      console.log('\x1b[33m',"Please confirm the above information before confirming the install.");
      if(ethereum_warn){
        console.log('\x1b[33m',ethereum_warn);
      }
      if(starfleet_warn){
        console.log('\x1b[33m',starfleet_warn);
      }
      if(xDai_warn){
        console.log('\x1b[33m',xDai_warn);
      }
      if(rinkeby_warn){
        console.log('\x1b[33m',rinkeby_warn);
      }
      if(kovan_warn){
        console.log('\x1b[33m',kovan_warn);
      }
      console.log('\x1b[33m',"Install cannot be stopped once setting are confirmed.");
      console.log('\x1b[33m',"#################################### WARNING ################################",'\n');

      (async () => {
        const response = await prompts({
          type: 'text',
          name: 'response',
          message: '\x1b[35mIs the above information correct? (y/n)'
        });

        if(response.response == 'y' || response.response == 'yes'){
                console.log('\x1b[35m', "Installing node to "+node_config.network.id+"...");
                console.log('\x1b[35m', "This may take awhile...");

                exec(install);

                console.log('\x1b[32m',"--------------------------------DISPLAYING LOGS------------------------------",'\n');
                var query = "sudo docker logs --since 2s otnode"
                var time = 1;
                //display logs
                var interval = setInterval(function() {
                   if (time <= 600) {
                     exec(query, (error, success, stderr) => {
                       if(stderr){

                       }else if (success == ""){
                         var autostart = 'sudo docker update --restart=always otnode'
                         exec(autostart);
                       }else{
                         console.log(success);
                         time++;
                       }
                      });
                   }else{
                     clearInterval(interval);
                   }
                }, 2000);
                return'success';

			}else{
			console.log('\x1b[31m',"Exited Install Menu.");
        }
      })();
    }catch(e){
      console.log('\x1b[31m',e);
      return'fail';
    }
  }
}
