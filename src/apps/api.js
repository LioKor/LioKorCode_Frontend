import ApiRequest from "../utils/requests";

export default class Api extends ApiRequest {
    signUp = (username, email, password, fullname) => this.post('/users', {username, email, password, fullname});
    signIn = (username, password) => this.post('/user/auth', {username, password});
    getUser = () => this.get('/user');
    updateUser = (userInfo) => this.put('/user', userInfo);
    signOut = () => this.delete('/user/session');
    updatePassword = (oldPassword, newPassword) => this.put('/user/password', {oldPassword, newPassword});
    updateAvatar = (avatarUrl) => this.put('/user/avatar', {avatarUrl});

    createTask = (taskData) => this.post(`/tasks`, taskData);
    getTasks = () => this.get(`/tasks`);
    getTask = (id) => this.get(`/tasks/${id}`);
    getMyTasks = () => this.get(`/tasks/user`);
    getUserTasks = (userId) => this.get(`/tasks/user/${userId}`);
    updateTask = (id, taskData) => this.put(`/tasks/${id}`, taskData);
    deleteTask = (id) => this.delete(`/tasks/${id}`);

    sendSolution = (id, solution) => this.post(`/tasks/${id}/solutions`, solution);
    getSolutions = (id) => this.get(`/tasks/${id}/solutions`);
    getSolution = (taskId, solutionId) => this.get(`/tasks/${taskId}/solutions/${solutionId}`);
    deleteSolution = (taskId, solutionId) => this.delete(`/tasks/${taskId}/solutions/${solutionId}`);


    // Mock redactor requests until backend finished it
    openRedactorSession = (files) => this.post(`/redactor`, files);
    checkRedactorSession = (uid) => this.get(`/redactor/${uid}`);
}
