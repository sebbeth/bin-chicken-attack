import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export function getDb() {
    const firebaseConfig = {
        databaseURL: "https://bin-chicken-attack-default-rtdb.firebaseio.com/",
        
    };
    
    const app = initializeApp(firebaseConfig);
    return getDatabase(app);
}