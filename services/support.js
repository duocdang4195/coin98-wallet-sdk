import axios from 'axios';

const RAW_TOKEN_LIST = 'https://rapid.coin98.com/token-list.json';
const RAW_SETTING = 'https://rapid.coin98.com/settings.json';

const useSupport = () => {
  const getTokenList = async () => {
    // return postGithub(RAW_TOKEN_LIST);
  };

  const getSetting = async () => {
    // return postGithub(RAW_SETTING);
  };

  const postGithub = async (link) => {
    return fetchAPI(link).catch();
  };

  const fetchAPI = async (link) => {
    try {
      const raw = await axios.get(link);
      console.log({ raw });
      return raw.json();
    } catch (err) {
      console.log({ err });
      throw err;
    }
  };

  return {
    getSetting,
    getTokenList,
  };
};

export default useSupport;
