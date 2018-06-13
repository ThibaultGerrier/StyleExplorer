import { Meteor } from 'meteor/meteor';

import '../imports/startup/server';

const fs = require('fs');
const { spawn } = require('child_process');

fs.writeFileSync(`${Meteor.settings.public.textLocation}/asd.txt`, 'hallo');

const cmd = spawn('java', ['-version'], { cwd: '.' });

cmd.stdout.on('data', d => console.log(d.toString()));
cmd.stderr.on('data', d => console.log(d.toString()));
