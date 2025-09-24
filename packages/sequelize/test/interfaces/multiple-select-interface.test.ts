import { Database, mockDatabase } from '../../src';
import { MultipleSelectInterface } from '../../src/interfaces/multiple-select-interface';
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe('MultipleSelectInterface', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase();
    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  describe('toValue', () => {
    it('should return value', async () => {
      const options = {
        uiSchema: {
          enum: [
            { value: '1', label: 'Label1' },
            { value: '2', label: 'Label2' },
          ],
        },
      };

      const interfaceInstance = new MultipleSelectInterface(options);
      const value = await interfaceInstance.toValue('Label1,Label2');
      expect(value).toEqual(['1', '2']);
    });
  });
});
