// api Promise化
export default (callback) => {
	return (object = {}) => {
		return new Promise((resolve, reject) => {
			object.success = (...args) => {
				resolve(...args)
			};
			object.fail = (...args) => {
				reject(...args)
			};
			object.complete = () => {}
			callback(object)
		})
	}
};
