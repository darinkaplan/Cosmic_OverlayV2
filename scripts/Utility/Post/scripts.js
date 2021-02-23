const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports ={

  startscripts: async function start(){
    try{
      var start = 'cd ./cron-jobs-node && forever start crontab.js'
      console.log('\x1b[35m',"Starting scripts...");
      await exec(start);
      console.log('\x1b[32m',"Scripts have started!");
    }catch(e){
      console.log('\x1b[31m',e);
    }
  },

  stopscripts: async function stop(){
    try{
      var stop = 'cd ./cron-jobs-node && forever stop crontab.js'
      console.log('\x1b[35m',"Stopping scripts...");
      await exec(stop);
       console.log('\x1b[32m',"Scripts have stopped!");
    }catch(e){
      //console.log('\x1b[31m',e);
    }
  },

  restartscripts: async function restart(){
    try{
      var restart = 'cd ./cron-jobs-node && forever restart crontab.js'
      console.log('\x1b[35m',"Restarting scripts...");
      await exec(restart);
       console.log('\x1b[32m',"Scripts have restarted!");
    }catch(e){
      //console.log('\x1b[31m',e);
    }
  }
}
