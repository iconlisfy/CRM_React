
let config = null;

export const loadConfig = async () => {
  if (!config) {
    const response = await fetch("/config.json");
    config = await response.json();
  }
  return config;
};

// Temporary config object for sync usage (will be updated later)
const configProxy = {
  api_url: '', // Will be updated by loader
};

export const configReady = loadConfig().then((loaded) => {
  configProxy.api_url = loaded.api_url;
});

export default configProxy;

