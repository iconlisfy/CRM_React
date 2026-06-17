import CryptoJS from 'crypto-js';

const encryptionKey = "sblw-3hn8-sqoy19"; 
const cache = new Map(); // Global cache

// AES Encryption function
export const encryptAES = (text, key) => {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

// AES Decryption function with cache support
export const decryptAES = (encryptedText, key) => {
    if (!encryptedText) return "N/A";

    // Return cached value if available
    if (cache.has(encryptedText)) {
        return cache.get(encryptedText);
    }

    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
    }, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    
    const decryptedValue = CryptoJS.enc.Utf8.stringify(decrypted);

    // Store decrypted value in cache for future use
    cache.set(encryptedText, decryptedValue);
    // console.log("Updated Cache: ", cache);

    return decryptedValue;
};

export const decryptData = (data, key, cache = new Map()) => {
    const decryptAES = (encryptedText) => {
        if (!encryptedText) return "N/A";

        // Return cached value if available
        if (cache.has(encryptedText)) {
            return cache.get(encryptedText);
        }

        const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
        const decrypted = CryptoJS.AES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
        }, keyUtf8, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedValue = CryptoJS.enc.Utf8.stringify(decrypted);

        // Store decrypted value in cache for future use
        cache.set(encryptedText, decryptedValue);

        return decryptedValue;
    };

    const decryptObject = (input) => {
        if (typeof input === "string") {
            // Decrypt if the value is a string
            return decryptAES(input);
        } else if (Array.isArray(input)) {
            // Iterate and decrypt each element if it's an array
            return input.map((item) => decryptObject(item));
        } else if (typeof input === "object" && input !== null) {
            // Decrypt each property if it's an object
            const decryptedObj = {};
            Object.keys(input).forEach((key) => {
                decryptedObj[key] = decryptObject(input[key]);
            });
            return decryptedObj;
        }
        // Return the value as is for unsupported types
        return input;
    };

    // Start the decryption process
    return decryptObject(data);
};