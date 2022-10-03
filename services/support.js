const RAW_TOKEN_LIST =
  'https://raw.githubusercontent.com/khiemsoft/coin98-token-list/main/token-list.json';
const RAW_SETTING =
  'https://raw.githubusercontent.com/khiemsoft/coin98-token-list/main/settings.json';

const useSupport = () => {
  const getTokenList = async () => {
    // return postGithub(RAW_TOKEN_LIST);
  };

  const getSetting = async () => {
    // return postGithub(RAW_SETTING);
  };

  const postGithub = async (link) => {
    return fetchAPI(link, {
      headers: {
        Authorization: 'Bearer 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',
      },
    }).catch();
  };

  const fetchAPI = async (link, options) => {
    try {
      const raw = await fetch(link, options);
      console.log({ raw });
      return raw.json();
    } catch (err) {
      console.log({ err });
    }
  };

  return {
    getSetting,
    getTokenList,
  };
};

export default useSupport;
