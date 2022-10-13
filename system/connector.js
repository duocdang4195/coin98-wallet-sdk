import { CHAIN_DATA, PROVIDER_PATH, SETTING_LOCAL } from '../common/constants';
import useSupport from '../services/support';

class Connector {
  constructor(options) {
    this.client = {};
    this.rpcConfig = SETTING_LOCAL;
    // this.initial();
  }

  // Get chain settings from chain key
  static getChainSetting(chain) {
    return CHAIN_DATA[chain];
  }

  // Get chain RPC config
  getRPC(chain) {
    return this.rpcConfig[chain];
  }

  // Connect and init a new chain for a case needed to use
  connect(connectedChain) {
    required(connectedChain, 0);

    connectedChain.forEach((chain) => {
      const Services = PROVIDER_PATH[chain.kind];
      if (!Services) return;
      // Renewable services for a case renew options
      const keyClient = chain.kind + '_' + chain.key;
      chain.options && this.client[keyClient] && delete this.client[keyClient];
      // Each services represents for an instance of chain and kind of this chain
      this.client[keyClient] = new Services({
        key: chain.key,
        options: chain.options,
        rpc: this.getRPC(chain.key),
      });
    });
  }

  // Get client connector for call in services
  // Initialized a new Services instance if forgot to create a connection
  getClient(chain) {
    const connectedChain = CHAIN_DATA[chain];
    if (!connectedChain) return;

    this.connect([connectedChain]);
    const keyClient = connectedChain.kind + '_' + connectedChain.key;
    return this.client[keyClient];
  }

  // Sync settings from server
  initial() {
    const { getSetting } = useSupport();
    getSetting()
      .then((res) => {
        this.rpcConfig = res;
      })
      .catch();
  }

  // Default RPC Configurable
  getDefaultRPC() {
    return SETTING_LOCAL;
  }
}

export default Connector;
