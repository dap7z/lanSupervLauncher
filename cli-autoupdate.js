'use strict';

const UpdateNotifier = require('update-notifier'),
      EventEmitter = require('events'),
      exec = require('child_process').exec;

class AutoUpdate extends EventEmitter {

  constructor(pkg) {

    super();
	
    this.pkg = pkg;
    this.updating = false;

    this.notifier = UpdateNotifier({
      pkg: pkg,
      callback: (err, info) => this.onCheck(err, info)
    });

  }

  onCheck(err, info) {

    if(err)
      return this.emit('error', err);

    if(info.type != 'latest'){
      this.update();
	}
    else{
      this.emit('ready');
	}

  }

  update() {

    this.updating = true;
    this.emit('update');

    const options = {
      env: process.env
    };
	
	let command = `npm install ${this.pkg.name}`;
	console.log(command);

    const npm = exec(
	  command,
      options,
      this.onUpdate.bind(this)
    );

  }

  onUpdate(err, stdout, stderr) {
	
    console.log(err);
    console.log(stdout);
    console.log(stderr);
	
    this.updating = false;
    this.emit('ready');

  }

}

exports = module.exports = AutoUpdate;
