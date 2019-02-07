module.exports = class ApplicationPolicy {

    constructor(user, record, collaborators) {
        this.user = user;
        this.record = record;
        this.collaborators = collaborators;
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin() {
        return this.user && this.user.role == 2;
    }

    _isPremium() {
        return this.user && this.user.role == 1;
    }

    _isStandard() {
        return this.user && this.user.role == 0;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {
        if(this.record.private == false){
            return this.new();
        } else {
            return this.new() && this.record && (this._isPremium() || this._isAdmin())
        }
    }

    showCollaborators(){
        return this.edit();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.new() && this._isAdmin();
    }
}