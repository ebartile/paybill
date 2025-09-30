import {
	Logger,
	ConsoleTransport,
	FileTransport,
	createConsoleLogger,
	clearAllLoggers,
	createLogger,
	loggers,
	createFileLogger,
	JSONTransport,
	type LoggerInfo,
	type ILogger,
} from "@paybilldev/logger";
import { join } from "path";
import {
	fileExists,
	finishLogger,
	getCurrentDateString,
	includeContent,
	matchContentTimes,
	removeFileOrDir,
	sleep,
} from "./util";
import * as os from "os";
import { readdirSync } from "fs";
import { supportsColor } from "@paybilldev/logger";
import { FileStreamRotatorManager } from "@paybilldev/logger";
import { afterEach, describe, expect, vi, it } from "vitest";

describe("/test/index.test.ts", () => {
	afterEach(() => {
		FileStreamRotatorManager.clear();
		vi.clearAllMocks();
		vi.resetAllMocks();
	});

	it("should output with console transport", () => {
		const logger = new Logger();
		logger.add("console", new ConsoleTransport());

		const fnStdout = vi.spyOn(process.stdout, "write");
		const fnStderr = vi.spyOn(process.stderr, "write");

		logger.verbose("test", "test1", "test2", "test3");
		expect(fnStdout.mock.calls[0][0]).toContain("test test1 test2 test3");

		logger.silly("test", 123, "test2", "test3");
		expect(fnStdout.mock.calls[1][0]).toContain("test 123 test2 test3");

		logger.info("test", 123, [3, 2, 1], "test3", new Error("abc"));
		expect(fnStdout.mock.calls[2][0]).toContain(
			"test 123 [ 3, 2, 1 ] test3 Error: abc",
		);

		logger.info("test", new Error("bcd"));
		expect(fnStdout.mock.calls[3][0]).toContain("test Error: bcd");

		logger.info("test", new Error("bcd"), new Error("cdd"));
		expect(fnStdout.mock.calls[4][0]).toContain("test Error: bcd");
		expect(fnStdout.mock.calls[4][0]).toContain("Error: cdd");

		logger.info("%s %d", "aaa", 222);
		expect(fnStdout.mock.calls[5][0]).toContain("aaa 222");

		// single data
		// string
		logger.error("plain error message");
		expect(fnStderr.mock.calls[0][0]).toContain("plain error message");
		// number
		logger.error(123);
		expect(fnStderr.mock.calls[1][0]).toContain("123");
		// array
		logger.error(["b", "c"]);
		expect(fnStderr.mock.calls[2][0]).toContain("[ 'b', 'c' ]");
		// string + number
		logger.error("plain error message", 321);
		expect(fnStderr.mock.calls[3][0]).toContain("plain error message 321");
		// format
		logger.error("format log, %j", { a: 1 });
		expect(fnStderr.mock.calls[4][0]).toContain('format log, {"a":1}');
		// set
		logger.info(new Set([2, 3, 4]));
		expect(fnStdout.mock.calls[6][0]).toContain("{ 2, 3, 4 }");
		// map
		logger.info(
			new Map([
				["key1", "value1"],
				["key2", "value2"],
			]),
		);
		expect(fnStdout.mock.calls[7][0]).toContain(
			"{ 'key1' => 'value1', 'key2' => 'value2' }",
		);
		// warn object
		logger.warn({ name: "Jack" });
		expect(fnStdout.mock.calls[8][0]).toContain("{ name: 'Jack' }");
		// error object
		logger.error(new Error("error instance"));
		expect(fnStderr.mock.calls[5][0]).toContain("Error: error instance");
		// named error
		const error = new Error("named error instance");
		error.name = "NamedError";
		// Directly output error
		logger.error(error);
		expect(fnStderr.mock.calls[6][0]).toContain("NamedError");
		expect(fnStderr.mock.calls[6][0]).toContain("named error instance");

		logger.close();
	});

	it("should test create logger with file transport", async () => {
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const coreLogger = new Logger({
			transports: {
				console: new ConsoleTransport(),
				file: new FileTransport({
					dir: logsDir,
					fileLogName: "core.log",
				}),
				error: new FileTransport({
					level: "error",
					dir: logsDir,
					fileLogName: "common-error.log",
				}),
			},
		});

		expect(coreLogger.get("console").level).toEqual("silly");
		expect(coreLogger.get("file").level).toEqual("silly");

		coreLogger.info("hello world1");
		coreLogger.info("hello world2");
		coreLogger.info("hello world3");
		coreLogger.warn("hello world4");
		coreLogger.error("hello world5");
		// After the adjustment, the console should be invisible, but the file is still written

		coreLogger.get("console").level = "warn";
		expect(coreLogger.get("console").level).toEqual("warn");
		coreLogger.info("hello world6");
		coreLogger.info("hello world7");
		coreLogger.info("hello world8");

		// The file will not be written
		coreLogger.get("file").level = "warn";
		expect(coreLogger.get("file").level).toEqual("warn");
		coreLogger.info("hello world9");
		coreLogger.info("hello world10");
		coreLogger.info("hello world11");

		await sleep();
		// test logger file exist
		expect(fileExists(join(logsDir, "core.log"))).toBeTruthy();
		expect(fileExists(join(logsDir, "common-error.log"))).toBeTruthy();

		// test logger file include content
		expect(
			includeContent(join(logsDir, "core.log"), "hello world1"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world2"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world3"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world4"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world5"),
		).toBeTruthy();

		expect(
			includeContent(join(logsDir, "core.log"), "hello world6"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world7"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world8"),
		).toBeTruthy();

		expect(
			includeContent(join(logsDir, "core.log"), "hello world9"),
		).toBeFalsy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world10"),
		).toBeFalsy();
		expect(
			includeContent(join(logsDir, "core.log"), "hello world11"),
		).toBeFalsy();

		// test error logger  file include content
		expect(
			includeContent(join(logsDir, "common-error.log"), "hello world1"),
		).toBeFalsy();
		expect(
			includeContent(join(logsDir, "common-error.log"), "hello world5"),
		).toBeTruthy();

		// test default eol
		expect(includeContent(join(logsDir, "core.log"), os.EOL)).toBeTruthy();
		expect(
			includeContent(join(logsDir, "common-error.log"), os.EOL),
		).toBeTruthy();

		coreLogger.close();
		await removeFileOrDir(logsDir);
	});

	it("should create custom logger and output content", async () => {
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const logger = new Logger({
			transports: {
				console: new ConsoleTransport(),
				file: new FileTransport({
					dir: logsDir,
					fileLogName: "custom-logger.log",
				}),
			},
		});

		logger.debug("test", "test1", "test2", "test3");
		logger.warn("test", "test4", "test5", 123, new Error("bcd"));
		logger.error("test2", "test6", 123, "test7", new Error("ef"), {
			label: "123",
		});
		// logger.info('hello world', { label: ['a', 'b'] });
		// logger.warn('warn: hello world', { label: 'UserService' });
		logger.info("%s %d", "aaa", 222);
		// string
		logger.error("plain error message");
		// number
		logger.error(123);
		// array
		logger.error(["b", "c"]);
		// string + number
		logger.error("plain error message", 321);
		// format
		logger.error("format log, %j", { a: 1 });
		// array
		logger.info(["Jack", "Joe"]);
		// set
		logger.info(new Set([2, 3, 4]));
		// map
		logger.info(
			new Map([
				["key1", "value1"],
				["key2", "value2"],
			]),
		);
		// warn object
		logger.warn({ name: "Jack" });
		// error object
		logger.error(new Error("error instance"));
		// named error
		const error = new Error("named error instance");
		error.name = "NamedError";
		// Directly output error
		logger.error(error);
		// Text first, plus error instance
		logger.info([1, 2, 3]);
		logger.info(new Error("info - error instance"));
		logger.info(
			"info - text before error",
			new Error("error instance after text"),
		);
		logger.error(
			"error - text before error",
			new Error("error instance after text"),
		);

		await finishLogger(logger);

		expect(fileExists(join(logsDir, "custom-logger.log"))).toBeTruthy();
		expect(fileExists(join(logsDir, "common-error.log"))).toBeFalsy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"test test1 test2 test3",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"test test4 test5 123 Error: bcd",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"test2 test6 123 test7 Error: ef",
			),
		).toBeTruthy();
		// expect(
		//   includeContent(join(logsDir, 'custom-logger.log'), '[a:b] hello world')
		// ).toBeTruthy();
		// expect(
		//   includeContent(
		//     join(logsDir, 'custom-logger.log'),
		//     '[UserService] warn: hello world'
		//   )
		// ).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "aaa 222"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "plain error message"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "123"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "[ 'b', 'c' ]"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "{ 2, 3, 4 }"),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"{ 'key1' => 'value1', 'key2' => 'value2' }",
			),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "plain error message"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), 'format log, {"a":1}'),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "[ 'Jack', 'Joe' ]"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "custom-logger.log"), "{ name: 'Jack' }"),
		).toBeTruthy();
		// error
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"named error instance",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"info - text before error",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "custom-logger.log"),
				"error - text before error",
			),
		).toBeTruthy();
		await removeFileOrDir(logsDir);
	});

	it("should create console file", async () => {
		await removeFileOrDir(join(process.cwd(), "common-error.log"));
		const consoleLogger = createConsoleLogger("consoleLogger");
		consoleLogger.debug("test", "test1", "test2", "test3");
		consoleLogger.error("test console error");
		console.log("---");
		const err = new Error("custom error");
		err.name = "MyCustomError";
		consoleLogger.error(err);
		consoleLogger.error(err, { label: 123 });
		consoleLogger.error("before:", err);
		console.log("---");
		consoleLogger.info("Startup took %d ms", 111);
		consoleLogger.info("%j", { a: 1 });
		consoleLogger.debug("1", "2", "3");
		consoleLogger.info("plain error message", 321);

		expect(fileExists(join(process.cwd(), "common-error.log"))).toBeFalsy();
	});

	it("should create logger and update configure", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const logger = createLogger<Logger>("testLogger", {
			transports: {
				console: new ConsoleTransport(),
			},
		});

		logger.error(new Error("test error"));
		await sleep();
		expect(fileExists(join(logsDir, "test-logger.log"))).toBeFalsy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test error"),
		).toBeFalsy();

		logger.add(
			"file",
			new FileTransport({
				dir: logsDir,
				fileLogName: "test-logger.log",
			}),
		);
		logger.error(new Error("another test error"));
		logger.info("this is a info message with empty label", { label: [] });
		logger.info("this is a info message with empty value label", { label: "" });
		logger.info("this is a info message with value label", { label: "ddd" });
		logger.info("this is a info message with array value label", {
			label: ["ccc", "aaa"],
		});

		await sleep();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "another test error"),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log"),
				"this is a info message with empty label",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log"),
				"this is a info message with empty label",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log"),
				"this is a info message with value label",
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log"),
				"this is a info message with array value label",
			),
		).toBeTruthy();

		await removeFileOrDir(logsDir);
	});

	it("should create logger with no symlink", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const timeFormat = getCurrentDateString();
		const logger = createLogger<Logger>("testLogger", {
			format: (info) => {
				return `${info.level.toUpperCase()} ${process.pid} ${info.args}`;
			},
			transports: {
				file: new FileTransport({
					dir: logsDir,
					fileLogName: "test-logger.log",
					createSymlink: false,
				}),
				error: new FileTransport({
					level: "error",
					dir: logsDir,
					fileLogName: "test-error.log",
					createSymlink: false,
				}),
			},
		});

		logger.error("test console error");

		await sleep();
		expect(fileExists(join(logsDir, "test-logger.log"))).toBeFalsy();
		expect(fileExists(join(logsDir, "test-error.log"))).toBeFalsy();
		expect(
			fileExists(join(logsDir, "test-logger.log." + timeFormat)),
		).toBeTruthy();
		expect(
			fileExists(join(logsDir, "test-error.log." + timeFormat)),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log." + timeFormat),
				`ERROR ${process.pid} test console error`,
			),
		).toBeTruthy();
		expect(
			includeContent(
				join(logsDir, "test-logger.log." + timeFormat),
				`ERROR ${process.pid} test console error`,
			),
		).toBeTruthy();
		await removeFileOrDir(logsDir);
	});

	it("should test container and create same logger", async () => {
		if (loggers.size > 0) {
			clearAllLoggers();
		}
		const logger1 = createConsoleLogger("consoleLogger");
		createConsoleLogger("anotherConsoleLogger");
		const logger3 = createConsoleLogger("consoleLogger");
		expect(logger1).toEqual(logger3);
		expect(loggers.size).toEqual(2);
		clearAllLoggers();
		expect(loggers.size).toEqual(0);
	});

	it("should test container with add logger", function () {
		if (loggers.size > 0) {
			clearAllLoggers();
		}
		const originLogger: any = createConsoleLogger("consoleLogger");
		expect(loggers.size).toEqual(1);
		const logger = new Logger();
		// Repeated addition will result in an error
		expect(() => {
			loggers.addLogger("consoleLogger", logger);
		}).toThrow();
		expect(loggers.size).toEqual(1);
		let consoleLogger: ILogger = loggers.getLogger("consoleLogger");
		expect(originLogger).toEqual(consoleLogger);

		// Allow repeated additions and return the original object directly
		loggers.addLogger("consoleLogger", originLogger, false);
		expect(loggers.size).toEqual(1);
		consoleLogger = loggers.getLogger("consoleLogger");
		expect(originLogger).toEqual(consoleLogger);

		// Allow repeated additions and replace the original object
		loggers.addLogger("consoleLogger", logger, false);
		expect(loggers.size).toEqual(1);
		consoleLogger = loggers.getLogger("consoleLogger");
		expect(logger).toEqual(consoleLogger);

		loggers.close("consoleLogger");
		expect(loggers.size).toEqual(0);
	});

	it("should create logger update level", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createLogger<Logger>("testLogger", {
			format: (info) => {
				return `${info.level.toUpperCase()} ${process.pid} ${info.args}`;
			},
			transports: {
				file: new FileTransport({
					dir: logsDir,
					fileLogName: "test-logger.log",
				}),
				error: new FileTransport({
					level: "error",
					dir: logsDir,
					fileLogName: "test-error.log",
				}),
			},
		});

		logger.info("test console info");
		logger.error("test console error");

		await sleep();
		expect(fileExists(join(logsDir, "test-error.log"))).toBeTruthy();
		expect(fileExists(join(logsDir, "test-logger.log"))).toBeTruthy();
		expect(
			includeContent(join(logsDir, "test-error.log"), "test console error"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console error"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console info"),
		).toBeTruthy();

		// after update level

		logger.level = "warn";

		logger.info("test console info2");
		logger.error("test console error2");

		await sleep();
		expect(
			includeContent(join(logsDir, "test-error.log"), "test console error2"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console error2"),
		).toBeTruthy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console info2"),
		).toBeFalsy();

		// after disable error and file

		logger.remove("error");
		logger.remove("file");

		logger.info("test console info3");
		logger.error("test console error3");
		await sleep();
		expect(
			includeContent(join(logsDir, "test-error.log"), "test console error3"),
		).toBeFalsy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console error3"),
		).toBeFalsy();
		expect(
			includeContent(join(logsDir, "test-logger.log"), "test console info3"),
		).toBeFalsy();

		// logger.enableFile();
		// logger.enableError();
		//
		// logger.warn('test console info4');
		// logger.error('test console error4');
		// await sleep();
		// expect(includeContent(join(logsDir, 'test-error.log'), 'test console error4')).toBeTruthy();
		// expect(includeContent(join(logsDir, 'test-logger.log'), 'test console error4')).toBeTruthy();
		// expect(includeContent(join(logsDir, 'test-logger.log'), 'test console info4')).toBeTruthy();

		await removeFileOrDir(logsDir);
	});

	it("should test common-error log", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger1 = createLogger<Logger>("logger", {
			transports: {
				error: new FileTransport({
					level: "error",
					dir: logsDir,
					fileLogName: "common-error.log",
				}),
			},
		});

		const logger2 = createLogger<Logger>("logger", {
			transports: {
				error: new FileTransport({
					level: "error",
					dir: logsDir,
					fileLogName: "common-error.log",
				}),
			},
		});

		expect(logger1).toEqual(logger2);
		logger1.error("output error by logger1");
		logger2.error("output error by logger2");

		await sleep();

		expect(
			matchContentTimes(
				join(logsDir, "common-error.log"),
				"output error by logger1",
			),
		).toEqual(1);
		expect(
			matchContentTimes(
				join(logsDir, "common-error.log"),
				"output error by logger2",
			),
		).toEqual(1);
		await removeFileOrDir(logsDir);
	});

	it("should use write method to file", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const logger = createLogger<Logger>("logger", {
			transports: {
				file: new FileTransport({
					level: "info",
					dir: logsDir,
					fileLogName: "core.log",
				}),
			},
		});
		logger.write("hello world");
		const buffer = Buffer.from("hello world", "utf-8");
		logger.write(buffer);

		await sleep();
		expect(
			matchContentTimes(join(logsDir, "core.log"), process.pid.toString()),
		).toEqual(0);
		expect(matchContentTimes(join(logsDir, "core.log"), "hello world")).toEqual(
			2,
		);
		await removeFileOrDir(logsDir);
	});

	it("should use write method to file and not write to error file", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const logger = createLogger<Logger>("logger", {
			transports: {
				file: new FileTransport({
					level: "silly",
					dir: logsDir,
					fileLogName: "core.log",
				}),
			},
		});
		logger.write("hello world");
		const buffer = Buffer.from("hello world", "utf-8");
		logger.write(buffer);

		await sleep();

		expect(matchContentTimes(join(logsDir, "core.log"), "hello world")).toEqual(
			2,
		);

		expect(
			matchContentTimes(join(logsDir, "common-error.log"), "hello world"),
		).toEqual(0);
		await removeFileOrDir(logsDir);
	});

	it("should test createFileLogger", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createFileLogger("file", {
			dir: logsDir,
			fileLogName: "test-logger.log",
		});

		logger.info("file logger");
		await sleep();

		expect(
			matchContentTimes(join(logsDir, "test-logger.log"), "file logger"),
		).toEqual(1);

		await removeFileOrDir(logsDir);
	});

	it("should change eol", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createFileLogger("file", {
			dir: logsDir,
			fileLogName: "test-logger.log",
			eol: "bbb\n",
		});

		logger.info("file logger");
		logger.info("file logger1");
		logger.info("file logger2");
		await sleep();

		expect(
			matchContentTimes(join(logsDir, "test-logger.log"), "bbb\n"),
		).toEqual(3);

		await removeFileOrDir(logsDir);
	});

	it("should no output when level = none", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createFileLogger("file", {
			dir: logsDir,
			fileLogName: "test-logger.log",
			level: "none",
		});

		logger.info("file logger");
		logger.info("file logger1");
		logger.info("file logger2");
		await sleep();

		expect(
			matchContentTimes(join(logsDir, "test-logger.log"), "file logger"),
		).toEqual(0);
		await removeFileOrDir(logsDir);
	});

	it("should output all level when level = all", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createFileLogger("file", {
			dir: logsDir,
			fileLogName: "test-logger.log",
			level: "all",
		});

		logger.info("file logger");
		logger.info("file logger1");
		logger.info("file logger2");
		await sleep();

		expect(
			matchContentTimes(join(logsDir, "test-logger.log"), "file logger"),
		).toEqual(3);
		await removeFileOrDir(logsDir);
	});

	it("should test color with console", function () {
		clearAllLoggers();
		process.env.FORCE_ENABLE_COLOR = "true";
		const fnStdout = vi.spyOn(process.stdout, "write");
		const fnStderr = vi.spyOn(process.stderr, "write");
		const consoleLogger = createConsoleLogger("consoleLogger", {
			autoColors: true,
		});
		consoleLogger.debug("test", "test1", "test2", "test3");
		consoleLogger.info("test", "test1", "test2", "test3");
		consoleLogger.warn("test", "test1", "test2", "test3");
		consoleLogger.error("test", "test1", "test2", "test3");
		expect(fnStdout.mock.calls[0][0]).toContain("\x1B");
		expect(fnStderr.mock.calls[0][0]).toContain("\x1B");
		process.env.FORCE_ENABLE_COLOR = "";
	});

	it("should test auto color with console", function () {
		clearAllLoggers();
		const fnStdout = vi.spyOn(process.stdout, "write");
		const fnStderr = vi.spyOn(process.stderr, "write");
		const consoleLogger = createConsoleLogger("consoleLogger", {
			autoColors: true,
		});
		consoleLogger.debug("test", "test1", "test2", "test3");
		consoleLogger.info("test", "test1", "test2", "test3");
		consoleLogger.warn("test", "test1", "test2", "test3");
		consoleLogger.error("test", "test1", "test2", "test3");

		const isTerminalSupportColor = supportsColor.stdout;
		if (isTerminalSupportColor) {
			expect(fnStdout.mock.calls[0][0]).toContain("\x1B");
			expect(fnStderr.mock.calls[0][0]).toContain("\x1B");
		} else {
			expect(fnStdout.mock.calls[0][0]).not.toContain("\x1B");
			expect(fnStderr.mock.calls[0][0]).not.toContain("\x1B");
		}
	});

	it("should test no color with console", function () {
		clearAllLoggers();
		const fn = vi.spyOn(process.stdout, "write");
		const consoleLogger = createConsoleLogger("consoleLogger");
		consoleLogger.debug("test", "test1", "test2", "test3");
		expect(fn.mock.calls[0][0]).not.toContain("\x1B");
	});

	it("should check info content", function () {
		const fn = vi.fn();
		const logger = createConsoleLogger("globalOutputConsoleLogger", {
			format: fn,
		}) as Logger;

		logger.info("test", "test1", "test2", "test3");
		expect(fn.mock.calls[0][0].originArgs).toEqual([
			"test",
			"test1",
			"test2",
			"test3",
		]);

		const err = new Error("abc");
		logger.info(err);
		expect(fn.mock.calls[1][0].args[0]).toEqual(err);

		const err2 = new Error("abc2");
		logger.info("abc", err2);
		expect(fn.mock.calls[2][0].args[1]).toEqual(err2);
	});

	it("should test change audit file logs", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createLogger("file", {
			transports: {
				file: new FileTransport({
					dir: logsDir,
					fileLogName: "test-logger.log",
					auditFileDir: join(logsDir, "tmp"),
				}),
				json: new JSONTransport({
					dir: logsDir,
					fileLogName: "test-logger.json.log",
					auditFileDir: join(logsDir, "tmp"),
				}),
			},
		});

		logger.info("file logger");
		logger.info("file logger1");
		logger.error("file logger2");
		await sleep();

		const dir = readdirSync(join(logsDir, "tmp"));
		expect(dir.length).toEqual(2);

		await removeFileOrDir(logsDir);
	});

	describe("Logger getChild method", () => {
		it("should create a child logger with correct meta data", () => {
			const logger = new Logger();
			const meta = { requestId: "123" };
			const childLogger = logger.getChild(meta);

			expect(childLogger).toBeDefined();
			expect(childLogger["meta"]).toEqual(meta);
		});

		it("should create a child logger with custom format", () => {
			const logger = new Logger();
			logger.add("console", new ConsoleTransport());
			const formatFn = vi.fn();
			const childLogger = logger.getChild({ format: formatFn });

			expect(childLogger).toBeDefined();
			expect(childLogger["meta"].format).toEqual(formatFn);

			childLogger.info("abc test %s", "ok");
			expect(formatFn).toHaveBeenCalled();
			expect(formatFn.mock.calls[0][0].args[0]).toEqual("abc test %s");
		});

		it("create add category and format in parent", () => {
			const formatFn = vi.fn(
				(
					info: LoggerInfo<{
						category: string;
					}>,
				) => {
					return info.meta.category + " " + info.args[0];
				},
			);

			const logger = new Logger({
				format: formatFn,
			});
			logger.add("console", new ConsoleTransport());

			const childLogger = logger.getChild({ category: "aaa" });
			childLogger.info("test");
			expect(formatFn).toHaveBeenCalled();
			expect(formatFn.mock.calls[0][0].meta.category).toEqual("aaa");
		});
	});
});
