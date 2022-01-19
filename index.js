const chalk = require('chalk');
const prompts = require('prompts');
const generateLicenseKey = require('./generateLicenceKey');


(async () => {
    try{
        const ppk_num = await prompts({
            type: 'number',
            name: 'value',
            message: ' Enter ppk number: ',
            validate: value => value <= 0 ? 'Enter a valid ppk number' : true
        });
    
        const key = await prompts({
            type: 'number',
            name: 'value',
            message: ' Enter ppk serial: ',
            validate: value => value <= 0 ? 'Enter a valid serial number' : true
        });     
        
        const licenceKeyArray = generateLicenseKey({ppk_num: ppk_num.value, key: key.value});
        //console.log(licenceKeyArray);

        console.log(`\n Licence key: ${chalk.blue.bold(generateLicenceKeyString(licenceKeyArray))}`);

        console.log('\n\n\n Appliation will be closed in 60 seconds');        
        await sleep(60000);
    } 
    catch(err){
        console.log(chalk.red(`\n ${err}`));
        await sleep(10000);
    };
})();

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

function generateLicenceKeyString(arr){
    const arrWithPad = [];

    for(let i = 0; i < arr.length; i++){
        arrWithPad.push(arr[i].toString().padStart(3, '0'));
    };

    return arrWithPad.join('-');
};
