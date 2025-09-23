import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    rollup: {
        emitCJS: true,
        esbuild: {
            treeShaking: true,
        },
    },
    declaration: true,
    outDir: "dist",
    clean: true,
    failOnWarn: false,
    externals: [
        // runtime dependencies
        "lodash",
        "dayjs",
        "chalk",
        "deepmerge",
        "dottie",
        "rimraf",
        "excel-date-to-js",
        "exponential-backoff",
        "flat",
        "glob",
        "nanoid",
        "node-sql-parser",
        "qs",
        "safe-json-stringify",
        "semver",
        "sequelize",
        "umzug",
        "moment",
        "uuid",

        // peer dependencies (optional databases)
        "mssql",
        "mysql",
        "mysql2",
        "oracledb",
        "pg",
        "sqlite3"
    ],
    entries: [
        "./src/index.ts",
    ],
});