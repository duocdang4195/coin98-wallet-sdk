import { required } from './common/utils';
import * as Constants from './common/constants';
import Wallet from './services';
import Connector from './system/connector'

global.required = required;

export default { Wallet, Constants, Connector };
