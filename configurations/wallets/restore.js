const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompts = require('prompts');
const overlay_config = require('../overlay_config.json');
const node_config = require('../node_config.json');

module.exports ={
  restore: async function restore(){
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
        console.log('development');
        var restore =  "sudo /root/OTRestore/restore.sh --environment=development --backupDir=/root/OTawsbackup"
        var image =  'sudo docker create --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+kovan+rinkeby+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }else if(overlay_config.environment == 'testnet'){
        console.log('testnet');
        var restore =  "sudo /root/OTRestore/restore.sh --environment=testnet --backupDir=/root/OTawsbackup"
        var image =  'sudo docker create --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+kovan+rinkeby+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }else{
        console.log('mainnet');
        var restore =  "sudo /root/OTRestore/restore.sh --environment=mainnet --backupDir=/root/OTawsbackup"
        var image =  'sudo docker create --log-driver json-file --log-opt max-size=1g --name=otnode --hostname='+node_config.network.hostname+' -p 8900:8900 -p 5278:5278 -p 3000:3000 -e LOGS_LEVEL_DEBUG=1 -e SEND_LOGS=1 -v ~/certs/:/ot-node/certs/ -v ~/.origintrail_noderc:/ot-node/.origintrail_noderc '+ethereum+starfleet+xDai+'quay.io/origintrail/otnode-test:feature_blockchain-service'
      }

      console.log('\x1b[33m',"#################################### WARNING ################################");
      console.log('\x1b[33m',"You are about to restore your OriginTrail node onto the "+node_config.network.id+" environment.");
      console.log('\x1b[33m',"Please confirm the above information before confirming the restore.");
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
      console.log('\x1b[33m',"Restore cannot be stopped once setting are confirmed.");
      console.log('\x1b[33m',"#################################### WARNING ################################",'\n');

      (async () => {
        const response = await prompts({
          type: 'text',
          name: 'response',
          message: '\x1b[35mIs the above information correct? (y/n)'
        });

        if(response.response == 'y' || response.response == 'yes'){
          //download image
          console.log('\x1b[35m',"Downloading otnode image...");
          console.log('\x1b[35m',"This may take awhile...");
          await exec(image);

          if (fs.existsSync(__dirname+'/ethereum.json')){
            console.log('\x1b[35m',"Moving Ethereum identity...");
            var mv_eth= 'sudo docker cp /root/OTawsbackup/erc725_identity.json otnode:/ot-node/data/erc725_identity.json'
            await exec(mv_eth);
          }else{

          }

          if (fs.existsSync(__dirname+'/starfleet.json')){
            console.log('\x1b[35m',"Moving Starfleet identity...");
            var mv_sfc = 'sudo docker cp /root/OTawsbackup/starfleet_identity.json otnode:/ot-node/data/starfleet_identity.json'
            await exec(mv_sfc);
          }else{

          }

          if (fs.existsSync(__dirname+'/xDai.json')){
            console.log('\x1b[35m',"Moving xDai identity...");
            var mv_xDai = 'sudo docker cp /root/OTawsbackup/xDai_identity.json otnode:/ot-node/data/xDai_identity.json'
            await exec(mv_xDai);
          }else{

          }

          if (fs.existsSync(__dirname+'/rinkeby.json')){
            console.log('\x1b[35m',"Moving Rinkeby identity...");
            var mv_rnk = 'sudo docker cp /root/OTawsbackup/rinkeby_identity.json otnode:/ot-node/data/rinkeby_identity.json'
            await exec(mv_rnk);
          }else{

          }

          if (fs.existsSync(__dirname+'/kovan.json')){
            console.log('\x1b[35m',"Moving Kovan identity...");
            var mv_kov = 'sudo docker cp /root/OTawsbackup/kovan_identity.json otnode:/ot-node/data/kovan_identity.json'
            await exec(mv_kov);
          }else{

          }

          console.log('\x1b[32m',"Otnode image has been installed.",'\n');
          var copyscript = "sudo mkdir -p /root/OTRestore && sudo docker cp otnode:/ot-node/current/scripts/restore.sh /root/OTRestore"
          await exec(copyscript);

          //run restore script
          console.log('\x1b[32m',"Node restore started!");
          await exec(restore);

          console.log('\x1b[32m',"Node has been restored!",'\n');

          //move arango db text file
          // console.log('\x1b[35m',"Moving an arango.txt file that can sometimes interfer with node backups to /root/OTarango_backup ...",'\n');
          // console.log('\x1b[35m',"Locating init directory for the container...");
          // var find_init = 'sudo find /var/lib/docker/overlay2/ -maxdepth 1 -name "*-init"'
          // const { stdout, stderr } = await exec(find_init);
          // console.log('\x1b[32m',"Container init directory has been located.",'\n');
          //
          // var container = stdout.slice(0,-6);
          // var container = stdout.slice(25,-6);
          // var move = 'sudo mkdir -p /root/OTarango_backup && sudo mv /var/lib/docker/overlay2/' +container+ '/merged/ot-node/data/arango.txt /root/OTarango_backup'
          // await exec(move);
          //
          // console.log('\x1b[32m',"Arango.txt moved from /var/lib/docker/overlay2/"+container+"/merged/ot-node/data/ to /root/OTarango_backup",'\n');
          var query = "sudo docker logs --since 2s otnode"
          var time = 1;
          //display logs
          console.log('\x1b[32m',"--------------------------------DISPLAYING LOGS------------------------------",'\n');
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
