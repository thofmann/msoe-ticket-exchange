'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: '.dist/'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: ['**/*.js'],
                        dest: '.test/'
                    }
                ]
            }
        },
        copy: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*.html',
                            '**/*.ico'
                        ],
                        dest: '.dist/'
                    }
                ]
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        'babelify'
                    ]
                },
                files: {
                    '.dist/public/bundle.js': 'src/public/views/main.jsx'
                }
            }
        },
        stylus: {
            compile: {
                files: {
                    '.dist/public/bundle.css': 'src/public/styles/main.styl'
                }
            },
            options: {
                'include css': true
            }
        },
        inline: {
            dist: {
                options: {
                    tag: ''
                },
                src: '.dist/public/index.html',
                dest: '.dist/public/index.html'
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc.json'
            },
            src: ['index.js', 'src/**/*.js', 'src/**/*.jsx']
        },
        mochacli: {
            options: {
                reporter: 'spec'
            },
            all: {
                files: {
                    src: ['.test/**/*.js']
                }
            }
        },
        clean: {
            coverage: ['coverage/', 'coverage.lcov', '.nyc_output/'],
            dist: ['.dist/'],
            test: ['.test/'],
            inline: ['.dist/public/bundle.js', '.dist/public/bundle.css'],
            database: ['.oak/']
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('build', ['clean:dist', 'babel:dist', 'browserify:dist', 'stylus', 'copy', 'inline', 'clean:inline']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli:all']);
    grunt.registerTask('delete-database', ['clean:database']);

};
