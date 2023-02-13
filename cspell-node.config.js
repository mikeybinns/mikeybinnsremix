const fs = require("fs");
const path = require("path");

/**
 * Search for `package.json`
 * @param {string} from - search `from` directory.
 * @returns {string} - path to package.json
 */
function findNearestPackageJson(from) {
	from = path.resolve(from);
	const parent = path.dirname(from);
	if (!from || parent === from) {
		return;
	}

	const pkg = path.join(from, "package.json");
	if (fs.existsSync(pkg)) {
		return pkg;
	}
	return findNearestPackageJson(parent);
}

/**
 * Load the nearest package.json
 * @param {string} cwd
 * @returns
 */
function loadPackage(cwd) {
	const pkgFile = findNearestPackageJson(cwd);
	if (!pkgFile) return;
	return JSON.parse(fs.readFileSync(pkgFile, "utf-8"));
}

function determinePackageNamesAndMethods(cwd = process.cwd()) {
	const packageImport = loadPackage(cwd) || {};
	const packageNames = Object.keys(packageImport.dependencies || {}).concat(
		Object.keys(packageImport.devDependencies || {})
	);
	return { packageNames };
}

module.exports = {
	words: determinePackageNamesAndMethods().packageNames,
};
