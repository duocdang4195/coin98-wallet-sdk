import axios from 'axios';

const nftClient = axios.create({
  baseURL: 'https://nfts.coin98.com',
});

const useNFTs = (chain) => {
  const sync = () => {
    nftClient.get(`sync/${chain}`);
  };

  const get = (address) => {
    return nftClient.get(`wallet/${chain}/${address}`);
  };

  return {
    get,
    sync,
  };
};

export default useNFTs;
