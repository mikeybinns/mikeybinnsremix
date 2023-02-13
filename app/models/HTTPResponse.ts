/**
 * HTTP responses types
 */
export type InformationResponseCodes = 100 | 101 | 102 | 103;
export type SuccessfulResponseCodes =
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 207
	| 208
	| 226;
export type RedirectionResponseCodes =
	| 300
	| 301
	| 302
	| 303
	| 304
	| 305
	| 306
	| 307
	| 308;
export type ClientErrorResponseCodes =
	| 400
	| 401
	| 402
	| 403
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 418
	| 421
	| 422
	| 423
	| 424
	| 425
	| 426
	| 428
	| 429
	| 431
	| 451;
export type ServerErrorResponseCodes =
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;
export type AnyValidResponseCode =
	| InformationResponseCodes
	| SuccessfulResponseCodes
	| RedirectionResponseCodes
	| ClientErrorResponseCodes
	| ServerErrorResponseCodes;

export function isInformationResponseCode(
	code:
		| InformationResponseCodes
		| SuccessfulResponseCodes
		| RedirectionResponseCodes
		| ClientErrorResponseCodes
		| ServerErrorResponseCodes
): code is InformationResponseCodes {
	if ([100, 101, 102, 103].includes(code)) {
		return true;
	}
	return false;
}
export function isSuccessfulResponseCode(
	code:
		| InformationResponseCodes
		| SuccessfulResponseCodes
		| RedirectionResponseCodes
		| ClientErrorResponseCodes
		| ServerErrorResponseCodes
): code is SuccessfulResponseCodes {
	if ([200, 201, 202, 203, 204, 205, 206, 207, 208, 226].includes(code)) {
		return true;
	}
	return false;
}
export function isRedirectionResponseCode(
	code:
		| InformationResponseCodes
		| SuccessfulResponseCodes
		| RedirectionResponseCodes
		| ClientErrorResponseCodes
		| ServerErrorResponseCodes
): code is RedirectionResponseCodes {
	if ([300, 301, 302, 303, 304, 305, 306, 307, 308].includes(code)) {
		return true;
	}
	return false;
}
export function isClientErrorResponseCode(
	code:
		| InformationResponseCodes
		| SuccessfulResponseCodes
		| RedirectionResponseCodes
		| ClientErrorResponseCodes
		| ServerErrorResponseCodes
): code is ClientErrorResponseCodes {
	if (
		[
			400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
			415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
		].includes(code)
	) {
		return true;
	}
	return false;
}
export function isServerErrorResponseCode(
	code:
		| InformationResponseCodes
		| SuccessfulResponseCodes
		| RedirectionResponseCodes
		| ClientErrorResponseCodes
		| ServerErrorResponseCodes
): code is ServerErrorResponseCodes {
	if ([500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511].includes(code)) {
		return true;
	}
	return false;
}
