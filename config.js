
import { decryptAES, decryptData } from './src/utils/Encryption';

const encryptionKey = "sblw-3hn8-sqoy19";

const getConfig = () => {
  const encryptedUsername = sessionStorage.getItem('username');
  const encryptedUserId = sessionStorage.getItem('userId');
  const encryptedBranch = sessionStorage.getItem('selectedBranch');
  const encryptedYearId = sessionStorage.getItem('selectedYrID') || sessionStorage.getItem('latestYearId');
  const encryptedBranchId = sessionStorage.getItem('selectedBranchKey');

  // Decrypt the data
  const decryptedUsername = encryptedUsername ? decryptData(encryptedUsername, encryptionKey) : '';
  const decryptedUserId = encryptedUserId ? decryptData(encryptedUserId, encryptionKey) : '';
  const decryptedBranch = encryptedBranch ? decryptData(encryptedBranch, encryptionKey) : '';
  const decryptedYearId = encryptedYearId ? decryptData(encryptedYearId, encryptionKey) : '';
  const decryptedBranchId = encryptedBranchId ? decryptData(encryptedBranchId, encryptionKey) : '';

  return {
    //public_apiUrl: config.api_url,
    //public_apiUrl: 'http://117.221.70.97:8081/api',
    //public_apiUrl: 'https://demoapi.lisfi.in/api',
    //public_apiUrl:'http://182.18.155.48:8002/api',
    //public_apiUrl:'https://neethivengoorapi.lisfi.in/api',
    //public_apiUrl: 'http://172.16.16.10:8078/api',
    // public_apiUrl: 'http://172.16.16.10:8081/api',
    public_yearId: decryptedYearId,
    public_branchId: decryptedBranchId,
    public_userName: decryptedUsername,
    public_branchName: decryptedBranch,
    public_userId: decryptedUserId,

    encrypted_yearId: encryptedYearId,
    encrypted_branchId: encryptedBranchId,

  };
};

export default getConfig;

