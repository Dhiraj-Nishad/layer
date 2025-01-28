import { ethers } from 'ethers';
import fs from 'fs/promises';
import readline from 'readline';
import log from './utils/logger.js';
import LayerEdge from './utils/socket.js';
import { readFile } from './utils/helper.js';
import fetch from 'node-fetch';

// Function to automatically fetch proxies and save them to proxy.txt
async function autoFetchProxies() {
    const proxySourceUrl = 'https://www.proxy-list.download/api/v1/get?type=https'; // Example URL for fetching proxies

    setInterval(async () => {
        try {
            const response = await fetch(proxySourceUrl);
            const data = await response.text();
            const proxies = data.split('\n').filter(proxy => proxy); // Split by new line and filter out empty lines

            // Save proxies to proxy.txt
            await fs.writeFile('proxy.txt', proxies.join('\n'), { flag: 'w' });
            log.info("Proxies fetched and saved to proxy.txt");
        } catch (error) {
            log.error('Error fetching proxies:', error.message);
        }
    }, 10000); // Fetch every 10 seconds
}

// Call the function to start fetching proxies
autoFetchProxies();

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

// ... (rest of your existing code)
