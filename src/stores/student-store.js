import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let students = new Map();

function getStudentByBackupEmail(email) {
    for (let student of students) {
        if (student.backupEmail === email) {
            return clone(student);
        }
    }
}

class StudentStore extends Store {

    getStudent(email) {
        return clone(students.get(email));
    }

    getStudentByBackupEmail(email) {
        return clone(getStudentByBackupEmail(email));
    }

}

const store = new StudentStore();

store.registerHandler('NEW_STUDENT', data => {
    if (students.has(data.email)) {
        throw new Error('This student email address is already in use.');
    }
    if (getStudentByBackupEmail(data.backupEmail) !== undefined) {
        throw new Error('This backup email address is already in use.');
    }
    students.set(data.studentEmail, {
        studentEmail: data.studentEmail,
        backupEmail: data.backupEmail,
        confirmedStudentEmail: false,
        confirmedBackupEmail: false,
        confirmStudentEmailToken: data.confirmStudentEmailToken,
        confirmBackupEmailToken: data.confirmBackupEmailToken,
        hashedPassword: data.hashedPassword,
        salt: data.salt,
        balance: {
            tickets: 0,
            satoshis: 0
        }
    });
});

store.registerHandler('CONFIRM_STUDENT_EMAIL', data => {
    let student = students.get(data.studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    if (student.confirmedStudentEmail) {
        throw new Error('This student email address is already confirmed.');
    }
    if (data.confirmStudentEmailToken !== student.confirmStudentEmailToken) {
        throw new Error('Invalid student email confirmation token.');
    }
    student.confirmedStudentEmail = true;
});

store.registerHandler('CONFIRM_BACKUP_EMAIL', data => {
    let student = getStudentByBackupEmail(data.backupEmail);
    if (student === undefined) {
        throw new Error('This backup email address is not in use.');
    }
    if (student.confirmedBackupEmail) {
        throw new Error('This student email address is already confirmed.');
    }
    if (data.confirmBackupEmailToken !== student.confirmBackupEmailToken) {
        throw new Error('Invalid backup email confirmation token.');
    }
    student.confirmedBackupEmail = true;
});

export default store;
