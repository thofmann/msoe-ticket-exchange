import { Store } from 'consus-core/flux';
import Cookies from 'js-cookie';

let studentEmail = Cookies.get('studentEmail');
let authTokenA = Cookies.get('authTokenA');
let authTokenB = Cookies.get('authTokenB');

class CredentialsStore extends Store {

    getStudentEmail() {
        return studentEmail;
    }

    getAuthTokenA() {
        return authTokenA;
    }

    getAuthTokenB() {
        return authTokenB;
    }

}

const store = new CredentialsStore();

store.registerHandler('UPDATE_STUDENT_EMAIL', data => {
    studentEmail = data.studentEmail;
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

export default store;
