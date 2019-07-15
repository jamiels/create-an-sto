// Step 1
const ganache = require('ganache-cli');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const config = require('config');
const HDWalletProvider = require('truffle-hdwallet-provider');

const contractLocation = path.resolve(__dirname,'contracts','BasicToken.sol');
const contract = fs.readFileSync(contractLocation,'utf8');

// npm i g solc@0.4.24

var run = async() => {
    console.log('Lets start')
    web3 = new Web3(ganache.provider());
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log(accounts[0])

    console.log(contract)

    console.log('Compiling..')

    compiled = solc.compile(contract,1).contracts[':BasicToken'];

    console.log('Compile completed')
    console.log(compiled.interface);
    console.log(compiled.bytecode);

    console.log('Deploying..')
    tokenContract = await new web3.eth.Contract(JSON.parse(compiled.interface))
        .deploy({data:'0x' + compiled.bytecode}).send({gas:'500000',from:accounts[0]});
    console.log('Done')

    
    console.log(tokenContract);
    console.log('Contract hash address:',tokenContract.options.address);

    console.log('Initial balances')

    amount = await tokenContract.methods.balanceOf(accounts[0]).call()
    console.log('Account 0, token issuer and holder:',amount)
 
    amount = await tokenContract.methods.balanceOf(accounts[1]).call()
    console.log('Tokens held by account 1:',amount)

    amount = await tokenContract.methods.balanceOf(accounts[2]).call()
    console.log('Tokens held by account 2:',amount)

    console.log('Allocating 10 tokens to account 2')

    await tokenContract.methods.allocate(accounts[2],10).send({from:accounts[0]});

    amount = await tokenContract.methods.balanceOf(accounts[0]).call()
    console.log('Available for sale:',amount)
 
    amount = await tokenContract.methods.balanceOf(accounts[1]).call()
    console.log('Tokens held by account 1:',amount)

    amount = await tokenContract.methods.balanceOf(accounts[2]).call()
    console.log('Tokens held by account 2:',amount) 

    console.log('Minting another 100')
    await tokenContract.methods.mint(100).send({from:accounts[0]});
    console.log('Available for sale:',amount)

    amount = await tokenContract.methods.balanceOf(accounts[0]).call()
    console.log('Tokens remaining for sale after minting 100:',amount)

    console.log('Burning 17')
    await tokenContract.methods.burn(17).send({from:accounts[0]});

    console.log('Tokens remaining for sale after burning 17:',amount)
    amount = await tokenContract.methods.balanceOf(accounts[0]).call()
    console.log('Tokens remaining for sale after burn:',amount)

    // will throw exception
    console.log('Minting another 100, but not by issuer')
    await tokenContract.methods.mint(100).send({from:accounts[1]});
    console.log('Available for sale:',amount)

    // Push to Rinkeby

    infuraAccessKey = config.get('infuraAccessKey');
    console.log(infuraAccessKey)
    mnemonic = config.get('mnemonic');

    infuraURL = "https://rinkeby.infura.io/v3/" + infuraAccessKey
    provider = new HDWalletProvider(mnemonic,infuraURL);
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // tokenContract = await new web3.eth.Contract(JSON.parse(compiled.interface))
    //     .deploy({data: '0x' + compiled.bytecode})
    //     .send({gas:'1000000',from:accounts[0]}); 
    // console.log('Rinkeby contract hash address',tokenContract.options.address);

    tokenHash = '0xC3fF3b043C65f801aEE1aac3Fb3d6EdE4849856C'
    tokenContract = await new web3.eth.Contract(JSON.parse(compiled.interface),'0xC3fF3b043C65f801aEE1aac3Fb3d6EdE4849856C');
    amount = await tokenContract.methods.balanceOf(accounts[0]).call()
    console.log('Account 0 on Rinkeby, token issuer and holder:',amount)


    await tokenContract.methods.allocate('0x72A2f1Ec914b40786c1feAfe819978E44FD941E7',10).send({from:accounts[0]});

    amount = await tokenContract.methods.balanceOf('0x72A2f1Ec914b40786c1feAfe819978E44FD941E7').call()
    console.log('Account 0, token issuer and holder:',amount)
    
    console.log('Deploying to Ethereum mainnet')
    infuraURL = "https://mainnet.infura.io/v3/" + infuraAccessKey
    provider = new HDWalletProvider(mnemonic,infuraURL);
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
    console.log(accounts);

    tokenContract = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data: '0x' + compiled.bytecode})
    .send({gas:'1000000',from:accounts[0]}); 
    console.log('Mainnet contract hash address',tokenContract.options.address);
 
}

run()

