import { Store } from 'consus-core/flux';
import Cookies from 'js-cookie';

let studentEmail = Cookies.get('studentEmail');
let backupEmail = Cookies.get('backupEmail');
let authTokenA = Cookies.get('authTokenA');
let authTokenB = Cookies.get('authTokenB');
let bitcoinDepositAddress = '';

class CredentialsStore extends Store {

    getStudentEmail() {
        return studentEmail;
    }

    getBackupEmail() {
        return backupEmail;
    }

    getAuthTokenA() {
        return authTokenA;
    }

    getAuthTokenB() {
        return authTokenB;
    }

    isAuthenticated() {
        return studentEmail !== undefined && authTokenA !== undefined && authTokenB !== undefined;
    }

    isAdmin() {
        return studentEmail === 'hofmannt@msoe.edu';
    }

    getBitcoinDepositAddress() {
        return bitcoinDepositAddress;
    }

}

const store = new CredentialsStore();

store.registerHandler('UPDATE_STUDENT_EMAIL', data => {
    studentEmail = data.studentEmail;
    store.emitChange();
});

store.registerHandler('UPDATE_BACKUP_EMAIL', data => {
    backupEmail = data.backupEmail;
    store.emitChange();
});

store.registerHandler('UPDATE_AUTH_TOKEN_A', data => {
    authTokenA = data.authTokenA;
    store.emitChange();
});

store.registerHandler('UPDATE_AUTH_TOKEN_B', data => {
    authTokenB = data.authTokenB;
    store.emitChange();
});

store.registerHandler('UPDATE_BITCOIN_DEPOSIT_ADDRESS', data => {
    bitcoinDepositAddress = data.bitcoinDepositAddress;
    store.emitChange();
});

store.registerHandler('LOGOUT', () => {
    studentEmail = undefined;
    backupEmail = undefined;
    authTokenA = undefined;
    authTokenB = undefined;
    bitcoinDepositAddress = '';
    store.emitChange();
});

export default store;
