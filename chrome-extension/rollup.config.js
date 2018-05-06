export default {
    input: "src/index.js",
    output: {
        file: "build/index.js",
        format: "umd",
        name: "index",
        exports: "named"
    }
};