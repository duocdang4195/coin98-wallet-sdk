import axios from 'axios';

const nftClient = axios.create({
  baseURL: 'https://nfts.coin98.com',
});

const useNFTs = (chain) => {
  const sync = () => {
    nftClient.get(`sync/${chain}`);
  };

  const get = ({address, page = 1, size = 10} = {}) => {
    return nftClient.get(`wallet/${chain}/${address}?page=${page}&size=${size}`);
  };

  return {
    get,
    sync,
  };
};

export default useNFTs;
