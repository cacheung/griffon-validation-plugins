import { ClientInfo, clientInfo } from '@adobe/griffon-toolkit-common';
// @ts-ignore
import plugin from './index';

const webClientInfo = clientInfo.mock({
  uuid: '1',
  payload: {
    deviceInfo: {
      'Canonical platform name': 'web'
    }
  }
}) as ClientInfo;

describe('First Mile Meta Client Connected', () => {
  it('should successfully validate when a client connect event is received', () => {
    const result = plugin([webClientInfo]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'matched'
    });
  });
});
