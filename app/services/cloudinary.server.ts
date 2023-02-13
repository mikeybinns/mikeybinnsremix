import type { UploadApiResponse } from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";

export async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
	const uploadPromise = new Promise<UploadApiResponse>(
		async (resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "imageUploads",
				},
				(error, result) => {
					if (error || !result) {
						reject(error);
						return;
					}
					resolve(result);
				}
			);
			await writeAsyncIterableToWritable(data, uploadStream);
		}
	);

	return uploadPromise;
}
