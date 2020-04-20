SJ.EventHandler =
class {
	_listeners = {};
    
    createEvent(eventName) {
        this._listeners[eventName] = [];
    }

	addEventListener(eventName, callback) {
		const listeners = this._listeners[eventName];
		const index = listeners.indexOf(callback);
		if (index === -1) {
			listeners.push(callback);
		}
	}
	
	removeEventListener(eventName, callback) {
		const listeners = this._listeners[eventName];
		const index = listeners.indexOf(callback);
		if (index !== -1) {
			listeners.splice(index, 1);
		}
	}
	
	callEvent(eventName) {
		this._listeners[eventName].forEach(listener => {
			listener();
		});
	}
}