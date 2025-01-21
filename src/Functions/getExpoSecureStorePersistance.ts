/*
  This is pulled from Sudoku.
  This is a function that is kinda not supposed to work. It is far more secure than what the firebase team made.
  I was not comfortable storing the refresh token in user defaults (as async storage does). So this is the same code but instead of Async Storeage it is stored in expo secure store.
*/
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as SecureStore from 'expo-secure-store';
import { Persistence } from "firebase/auth/dist/auth/index"

enum PersistenceType {
  SESSION = "SESSION",
  LOCAL = "LOCAL",
  NONE = "NONE"
}
type PersistedBlob = Record<string, unknown>;
type PersistenceValue = PersistedBlob | string;
interface StorageEventListener {
  (value: PersistenceValue | null): void;
}
interface PersistenceInternal extends Persistence {
  type: PersistenceType;
  _isAvailable(): Promise<boolean>;
  _set(key: string, value: PersistenceValue): Promise<void>;
  _get<T extends PersistenceValue>(key: string): Promise<T | null>;
  _remove(key: string): Promise<void>;
  _addListener(key: string, listener: StorageEventListener): void;
  _removeListener(key: string, listener: StorageEventListener): void;
  _shouldAllowMigration?: boolean;
}
function getKey(key: string) {
  return key.replace(RegExp(/[:\[\]]/g), "")
}


/**
 * Returns a persistence object that wraps `AsyncStorage` imported from
 * `react-native` or `@react-native-community/async-storage`, and can
 * be used in the persistence dependency field in {@link initializeAuth}.
 *
 * @public
 */
export default function getExpoSecureStorePersistence(): Persistence {
  // In the _getInstance() implementation (see src/core/persistence/index.ts),
  // we expect each "externs.Persistence" object passed to us by the user to
  // be able to be instantiated (as a class) using "new". That function also
  // expects the constructor to be empty. Since ReactNativeStorage requires the
  // underlying storage layer, we need to be able to create subclasses
  // (closures, essentially) that have the storage layer but empty constructor.
  return class implements PersistenceInternal {
    static type: 'LOCAL' = 'LOCAL';
    readonly type: PersistenceType = PersistenceType.LOCAL;

    async _isAvailable(): Promise<boolean> {
      try {
        const result = await SecureStore.isAvailableAsync()
        return result
      } catch {
        return false;
      }
    }

    _set(key: string, value: PersistenceValue): Promise<void> {
      console.log(key, value)
      return SecureStore.setItemAsync(getKey(key), JSON.stringify(value), {
        keychainService: "UTTT"
      });
    }

    async _get<T extends PersistenceValue>(key: string): Promise<T | null> {
      console.log("geeting", key)
      const json = await SecureStore.getItemAsync(getKey(key), {
        keychainService: "UTTT"
      });
      return json ? JSON.parse(json) : null;
    }

    _remove(key: string): Promise<void> {
      console.log("remopve", key)
      return SecureStore.deleteItemAsync(getKey(key));
    }

    _addListener(_key: string, _listener: StorageEventListener): void {
      // Listeners are not supported for React Native storage.
      return;
    }

    _removeListener(_key: string, _listener: StorageEventListener): void {
      // Listeners are not supported for React Native storage.
      return;
    }
  };
}