const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompts = require('prompts');
const overlay_config = require('../../../configurations/overlay_config.json');
const node_config = require('../../../configurations/node_config.json');

module.exports ={
  newnode: async function install(){
    try{
      console.log('\x1b[35m','Node Configuration:');
      var nodecfg = 'sudo cat /root/.origintrail_noderc'
      var nodecfg = await exec(nodecfg);
      console.log('\x1b[32m',nodecfg.stdout);

      const implementations = node_config.blockchain.implementations;
      var chain_count  = Object.keys(implementations).length;
      var chain_count = Number(chain_count);

      ethereum_warn = ''
      mv_eth = ''

      starfleet_warn = ''
      mv_sfc = ''

      xDai_warn = ''
      mv_xDai = ''

      rinkeby_warn = ''
      mv_rnk = ''

      kovan_warn = ''
      mv_kov = ''

      for(var i = 0; i < chain_count; i++) {
        var obj = Object.entries(implementations)[i];
        var obj = obj[1];
        var blockchain = obj.network_id

        if (blockchain == 'ethereum'){
          ethereum_warn = 'You are restoring to the Ethereum blockchain.'
        }

        if (blockchain == 'starfleet'){
          starfleet_warn = 'You are restoring to the Starfleet blockchain.'
        }

        if (blockchain == 'xDai'){
          xDai_warn = 'You are restoring to the xDai blockchain.'
        }

        if (blockchain == 'rinkeby'){
          rinkeby_warn = 'You are restoring to the Rinkeby blockchain.'
        }

        if (blockchain == 'kovan'){
          kovan_warn = 'You are restoring to the Kovan blockchain.'
        }
      }

      if(overlay_config.environment == 'development'){
        var install = 'sudo docker run --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc quay.io/origintrail/otnode-test:feature_blockchain-service'
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
