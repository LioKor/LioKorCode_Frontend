import ApiRequest from "../utils/requests";

export default class Api extends ApiRequest {
    constructor(url) {super(url)}

    getUser = () => this.get('/user');

    getTasks = () => this.get(`/tasks`);
    getTask = (id) => this.get(`/tasks/${id}`);

    getSolutions = (id) => this.get(`/tasks/${id}/solutions`);
    getSolution = (taskId, solutionId) => this.get(`/tasks/${taskId}/solutions/${solutionId}`);
    sendSolution = (id, solution) => this.post(`/tasks/${id}/solutions`, solution)
}
