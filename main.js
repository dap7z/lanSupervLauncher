'use strict';

/******************************************************************************
 lanSupervLaunch monitor lan-superv npm module :
 - Installation
 - Update
 - Launch at OS startup
******************************************************************************/

const Os = require('os');
const Fs = require("fs");
const AutoUpdate = require('./cli-autoupdate.js');
const LanSuperv = require('lan-superv');
const PACKAGE_TO_UPDATE = 'lan-superv';

let app = null;
let nodePath = process.execPath;
let appPath = __filename;
//console.log(nodePath +' '+ appPath);



//1) Apply launch at os startup
var platform = Os.platform();
if (platform.indexOf('win') === 0)
{
	// (only on windows)
    // Create a new service object
	var Service = require('node-windows').Service;

	var svc = new Service({
		name:'lanSupervLauncher',
		description: ':)',
		script: appPath,
		wait: 120,
		grow: .5
	});
	// Listen for the "install" event, which indicates the
	// process is available as a service.
	svc.on('install',function(){
		svc.start();
		console.log('[lanSupervLauncher] service installed');
	});
	svc.install();
	//no command window, only logs :
	//lanSupervLauncher\daemon\lansupervlauncher.err.log
	//lanSupervLauncher\daemon\lansupervlauncher.out.log
	//--
	//For uninstall :
	////Listen for the "uninstall" event so we know when it's done.
	//svc.on('uninstall',function(){
	//  console.log('Uninstall complete.');
	//  console.log('The service exists: ',svc.exists);
	//});
	//// Uninstall the service.
	//svc.uninstall();

}else{
	console.log("Please use pm2 to execute main.js after computer startup.");
	console.log("pm2 start main.js");
	console.log("pm2 save");
}



//2) Make application up to date
async function checkUpdate(){

    var fileContents = Fs.readFileSync(__dirname+'/package.json');
    var pkg = JSON.parse(fileContents);
	pkg['name'] = PACKAGE_TO_UPDATE;
	pkg['version'] = pkg['dependencies'][PACKAGE_TO_UPDATE];
	if(isNaN(pkg['version'].substr(0,1))){
		//exemple: ^0.3.1
		pkg['version'] = pkg['version'].substr(1);
	}

	const update = new AutoUpdate(pkg);
	update.on('update', function(){
		console.log('started update')
		if(app){
			console.log('[lanSupervLauncher] stopApplication');
			app.stopApplication();
			app = null;
		}
	});
	update.on('ready', function(){
		console.log('[lanSupervLauncher] ready (updated or not !)');
		//3) (Re)launch application
		if(app===null){
			console.log('[lanSupervLauncher] startApplication');
			app = new LanSuperv();
			var ConfigFile = __dirname + '/config.js';
			app.startApplication(ConfigFile);
			//(initial launch or relaunch after update)
		}
	});

}

setInterval(checkUpdate, 100*60*60*24);	//(1 day)
checkUpdate();

