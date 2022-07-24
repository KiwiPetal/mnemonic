import { ethers } from "ethers";
import words from "./words.js";
import { writeFileSync } from "fs";

const ethprovider = new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/298fd80b74f1485ab6f1e56d78a4d057");
let totalAddresses = 0;
let addresses = {};
let data = [];
addresses.data = data;

function checkDupes(array, element) {
    try {
        for (let i = 0; i < array.length; i++)
            if (array[i] == element) return true;
        return false;
    } catch (e) {
        return false;
    }
}

function generateWord(mnemonic) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    if (checkDupes(mnemonic, randomWord))
        return generateWord();
    return randomWord;
}

function generateMnemonic() {
    let mnemonic = [];
    let string = '';
    for (let i = 0; i < 12;) {

        mnemonic[i] = generateWord(mnemonic);
        string += mnemonic[i].toString() + ' ';
        i += 1;
    }
    ;
    return string.slice(0, -1);
}

async function checkwallet(mnemonic) {
    try {
        let targetWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let targetAddress = targetWallet.address;        
        let balance = await ethprovider.getBalance(targetAddress);
        if (balance == 0) {
            return false;
        }
        balance = ethers.utils.formatEther(balance);
        totalAddresses += 1;
        let completedAddress = {
            "Mnemonic": mnemonic,
            "Address": targetAddress,
            "Balance": balance.toString() + " ETH"
        }
        console.clear();
        console.log("Total addresses found: " + totalAddresses);
        addresses.data.push(completedAddress);
        writeFileSync('./result.json', JSON.stringify(addresses, null, 2), 'utf8');
        return true;
    } catch (e) {
        return false;
    }
}

async function main() {
    for (let i = 1; i != 0;) {
        let mnemonic = generateMnemonic();
        console.clear();
        console.log("Looking for addresses =^._.^=\nTotal mnemonics generated: " + i + "\nTotal amount of addresses with balance: " + totalAddresses);
        i++;
        await checkwallet(mnemonic);
    }
}

console.clear();
console.log("Looking for addresses =^._.^=");
main();
