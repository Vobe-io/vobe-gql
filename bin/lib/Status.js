export default class Status {

    constructor(success = false, message = undefined) {
        this.success = success;
        this.message = message;
        this.error = undefined;
    }

    success = false;
    message;

}