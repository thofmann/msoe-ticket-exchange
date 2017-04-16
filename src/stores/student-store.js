import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let students = new Map();

class StudentStore extends Store {

    getStudent(email) {
        return clone(students.get(email));
    }

    getStudentByBackupEmail(email) {
        for (let student of students) {
            if (student.backupEmail === email) {
                return clone(student);
            }
        }
    }

}

const store = new StudentStore();

store.registerHandler('NEW_STUDENT', data => {
    if (students.has(data.email)) {
        throw new Error('This student email address is already in use.');
    }
    if (store.getStudentByBackupEmail(data.backupEmail) !== undefined) {
        throw new Error('This backup email address is already in use.');
    }
    students.set(data.studentEmail, {
        studentEmail: data.studentEmail,
        backupEmail: data.backupEmail,
        confirmedStudentEmail: false,
        confirmedBackupEmail: false,
        hashedPassword: data.hashedPassword,
        salt: data.salt
    });
});

export default store;
