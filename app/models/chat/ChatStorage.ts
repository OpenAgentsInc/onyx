import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabaseAsync('onyx.db');

export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY NOT NULL, messages TEXT);',
        [],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};

export const loadChat = async (chatId: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT messages FROM chats WHERE id = ?;',
        [chatId],
        (_, { rows: { _array } }) => resolve(_array[0]?.messages || '[]'), // Return empty array if no chat found
        (_, error) => reject(error)
      );
    });
  });
};

export const saveChat = async (chatId: string, messages: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO chats (id, messages) values (?, ?);',
        [chatId, messages],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};
