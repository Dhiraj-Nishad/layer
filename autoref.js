import { ethers } from 'ethers';
import fs from 'node:fs/promises'; // Use node: prefix for built-in modules
import readline from 'node:readline'; // Use node: prefix for built-in modules
import log from './utils/logger.js'; // Ensure correct path and extension
import LayerEdge from './utils/socket.js'; // Ensure correct path and extension
import { readFile } from './utils/helper.js'; // Ensure correct path and extension

function createNewWallet() {
    const wallet = ethers.Wallet.createRandom();

    const walletDetails = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase
    };

    log.info("New Ethereum Wallet created Address:", walletDetails.address);

    return walletDetails;
}

async function saveWalletToFile(walletDetails) {
    let wallets = [];
    try {
        if (await fs.stat("wallets.json").catch(() => false)) {
            const data = await fs.readFile("wallets.json", "utf8");
            wallets = JSON.parse(data);
        }
    } catch (err) {
        log.error("Error reading wallets.json:", err);
    }

    wallets.push(walletDetails);

    try {
        await fs.writeFile("wallets.json", JSON.stringify(wallets, null, 2));
        log.info("Wallet saved to wallets.json");
    } catch (err) {
        log.error("Error writing to wallets.json:", err);
    }
}

// Function to ask a question 
async function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function autoRegister() {
    const proxies = await readFile('proxy.txt');
    if (proxies.length === 0) {
        log.warn('No proxies found, running without proxy...');
    }
    
    const numberOfWallets = await askQuestion("How many wallets do you want to create? ");
    
    for (let i = 0; i < numberOfWallets; i++) {
        const proxy = proxies[i % proxies.length] || null;
        try {
            log.info(`Creating Wallet: ${i + 1}/${numberOfWallets} Using Proxy:`, proxy);
            const walletDetails = createNewWallet();
            // Removed referral code handling
            await saveWalletToFile(walletDetails);

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            log.error('Error creating wallet:', error.message);
        }
    }
}

autoRegister();
