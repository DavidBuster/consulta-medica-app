export function capitalizeFirstLetter(str) {
	if (typeof str !== 'string') {
		return ''
	}

	if (str.length === 0) {
		return str // Return an empty string as is
	}

	const firstLetter = str.charAt(0).toUpperCase()
	const restOfString = str.slice(1).toLowerCase()

	return firstLetter + restOfString
}
