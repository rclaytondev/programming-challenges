module.exports = function(grunt) {
	grunt.initConfig({
		eslint: {
			src: ["*.js"]
		}
	});

	grunt.loadNpmTasks("gruntify-eslint");
	grunt.registerTask("default", ["eslint"]);
};
