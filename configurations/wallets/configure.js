const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

module.exports ={
  createconfigs: async function createconfigs() {
    //set firewall
    try{

      var wallet_dir = 'sudo mkdir /root/wallets -p && sudo chmod -R 777 /root/wallets'
      await exec(wallet_dir);

      var removeconfig = 'sudo rm -rf /root/wallets/*'
      await exec(removeconfig);

      if (fs.existsSync(__dirname+'/ethereum.json')){
        console.log('\x1b[35m',"Writing Ethereum wallet file configuration...");
        var eth = 'sudo cp '+__dirname+'/ethereum.json /root/wallets/ethereum.json'
        await exec(eth);

        console.log('\x1b[35m',"Checking configuration for syntax errors...",'\n');
        var jqcheck = 'jq "." /root/wallets/ethereum.json'
        await exec(jqcheck);

      }

      if(fs.existsSync(__dirname+'/starfleet.json')){
        console.log('\x1b[35m',"Writing Starfleet wallet file configuration...");
        var sfc = 'sudo cp '+__dirname+'/starfleet.json /root/wallets/starfleet.json'
        await exec(sfc);

        console.log('\x1b[35m',"Checking configuration for syntax errors...",'\n');
        var jqcheck = 'jq "." /root/wallets/starfleet.json'
        await exec(jqcheck);

      }

      if(fs.existsSync(__dirname+'/xDai.json')){
        console.log('\x1b[35m',"Writing xDai wallet file configuration...");
        var xDai = 'sudo cp '+__dirname+'/xDai.json /root/wallets/xDai.json'
        await exec(xDai);

        console.log('\x1b[35m',"Checking configuration for syntax errors...",'\n');
        var jqcheck = 'jq "." /root/wallets/xDai.json'
        await exec(jqcheck);

      }

      if(fs.existsSync(__dirname+'/rinkeby.json')){
        console.log('\x1b[35m',"Writing Rinkeby wallet file configuration...");
        var rink = 'sudo cp '+__dirname+'/rinkeby.json /root/wallets/rinkeby.json'
        await exec(rink);

        console.log('\x1b[35m',"Checking configuration for syntax errors...",'\n');
        var jqcheck = 'jq "." /root/wallets/rinkeby.json'
        await exec(jqcheck);

      }

      if(fs.existsSync(__dirname+'/kovan.json')){
        console.log('\x1b[35m',"Writing Kovan wallet file configuration...");
        var kov = 'sudo cp '+__dirname+'/kovan.json /root/wallets/kovan.json'
        await exec(kov);

        console.log('\x1b[35m',"Checking configuration for syntax errors...",'\n');
        var jqcheck = 'jq "." /root/wallets/kovan.json'
        await exec(jqcheck);

      }

      console.log('\x1b[32m',"All wallet configurations have been created.",'\n');
      return 'success';

    }catch(e){
      console.error('\x1b[31m',e,'Failed to create configurations.');
      return 'fail';
    }
  }
}
