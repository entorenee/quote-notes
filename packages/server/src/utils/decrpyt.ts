/* eslint-disable import/no-extraneous-dependencies */
import { KMS } from 'aws-sdk';

const kms = new KMS({ apiVersion: '2014-11-06' });

const decrypt = (keyId: string, base64String: string): Promise<string> =>
  new Promise((res, rej): void => {
    kms.decrypt(
      {
        CiphertextBlob: Buffer.from(base64String, 'base64'),
        KeyId: keyId,
      },
      (err, data): void => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err, err.stack);
          return rej(err);
        }

        if (!data?.Plaintext) {
          return rej(new Error('No decrypted key returned'))
        }

        return res(data.Plaintext.toString());
      },
    );
  });

export default decrypt;
