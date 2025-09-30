import { join } from "path";
import {
	fileExists,
	includeContent,
	matchContentTimes,
	removeFileOrDir,
	sleep,
} from "./util";
import {
	clearAllLoggers,
	createLogger,
	Logger,
	JSONTransport,
	type LoggerInfo,
	FileTransport,
} from "@paybilldev/logger";
import { FileStreamRotatorManager } from "@paybilldev/logger";
import { afterEach, describe, expect, vi, it } from "vitest";

describe("/test/json.test.ts", function () {
	afterEach(() => {
		FileStreamRotatorManager.clear();
	});

	it("should test create logger with json output", async () => {
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createLogger<Logger>("testLogger", {
			transports: {
				json: new JSONTransport({
					dir: logsDir,
					fileLogName: "test-logger.json.log",
				}),
			},
		});

		logger.info("abcd");
		logger.info("bcde");
		logger.info("efghi");
		logger.info({
			a: 1,
			b: 2,
		});
		logger.error(new Error("abc"), "bbb");
		logger.write("cccc");

		logger.close();

		expect(fileExists(join(logsDir, "test-logger.json.log")));
		expect(includeContent(join(logsDir, "test-logger.json.log"), "Error: abc"));
		expect(
			includeContent(
				join(logsDir, "test-logger.json.log"),
				'"level":"TRACE","message":"cccc"',
			),
		);
		await removeFileOrDir(logsDir);
	});

	it("should test create logger with json output and custom format", async () => {
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);

		const logger = createLogger<Logger>("testLogger", {
			transports: {
				json: new JSONTransport({
					dir: logsDir,
					fileLogName: "test-logger.json.log",
					format: (info: LoggerInfo) => {
						return {
							...info,
							ttt: info.LEVEL,
						};
					},
				}),
			},
		});

		logger.info("abcd");
		logger.info("bcde");
		logger.info("efghi");
		logger.info({
			a: 1,
			b: 2,
		});

		logger.close();

		expect(fileExists(join(logsDir, "test-logger.json.log")));
		expect(
			includeContent(join(logsDir, "test-logger.json.log"), '"LEVEL":"INFO"'),
		);
		await removeFileOrDir(logsDir);
	});

	// it('should throw error when log name not set', function () {
	//   expect(() => {
	//     createLogger<Logger>('testLogger', {
	//       enableError: false,
	//       enableJSON: true,
	//       enableFile: false,
	//     });
	//   }).toThrowError(/Please set jsonLogName when enable output json/);
	// });

	it("should test createContextLogger from logger with custom context format and output json", async () => {
		clearAllLoggers();
		const logsDir = join(__dirname, "logs");
		await removeFileOrDir(logsDir);
		const logger = createLogger<Logger>("testLogger", {
			transports: {
				file: new FileTransport({
					level: "debug",
					dir: logsDir,
					fileLogName: "test-logger.log",
					format: (info) => {
						return info.ctx.data + " " + info.message;
					},
					contextFormat: (info) => {
						return info.ctx.data + " abc " + info.message;
					},
				}),
				json: new JSONTransport({
					level: "debug",
					dir: logsDir,
					fileLogName: "test-logger.json.log",
					format: (info: LoggerInfo) => {
						return {
							...info,
							data: info.ctx.data, // or whatever property you need
						};
					},
				}),
			},
		});

		const ctx = { data: "custom data" };
		const contextLogger = logger.createContextLogger(ctx);

		const fn = vi.spyOn(logger, "transit");

		contextLogger.info("hello world");
		expect(fn.mock.calls[0][2]).toEqual("hello world");
		contextLogger.debug("hello world");
		expect(fn.mock.calls[1][2]).toEqual("hello world");

		await sleep();

		expect(
			matchContentTimes(
				join(logsDir, "test-logger.log"),
				"custom data abc hello world",
			),
		).toEqual(2);

		expect(
			matchContentTimes(join(logsDir, "test-logger.json.log"), "custom data"),
		).toEqual(2);

		await removeFileOrDir(logsDir);
	});
});
