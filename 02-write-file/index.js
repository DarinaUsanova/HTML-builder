const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/output.txt';
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome! Enter text (type "exit" to quit):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('See you later! Exiting the program.');
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  console.log('See you later! Exiting the program.');
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});
