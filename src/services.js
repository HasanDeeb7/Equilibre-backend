import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./config/ s3Config.js";

async function deleteImage(url) {
  const bucketName = "equilibre"
  const urlParts = url.split("/");

  // Get the last part (filename) of the URL
  const objectKey = urlParts[urlParts.length - 1];

  // Set parameters for the DeleteObjectCommand
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    // Delete the object from the S3 bucket
    const command = new DeleteObjectCommand(params);
    const result = await s3.send(command);

    // // Log or handle the success result
    // console.log("Object deleted successfully:", result);
    return result;
  } catch (error) {
    // Log or handle the error
    console.error("Error deleting object:", error);
    throw error;
  }
}



export { deleteImage };
