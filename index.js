const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const directoryIn = 'C:/Users/agnes/Downloads/barwo-s3-images-archive';
const directorOut = 'C:/Users/agnes/Downloads/barwo-s3-images-resized';
const resizedFileSuffix = '';
const widthCeiling = 1920;
const heightCeiling = 1920;

const getFileNameWithoutExt = fileName => {
  const idxOfDot = fileName.lastIndexOf('.');
  if (idxOfDot < 0) {
    return fileName;
  }
  return fileName.substring(0, idxOfDot);
};

const getFileExtWithDot = fileName => {
  return path.extname(fileName);
};

const batchImageResize = async _ => {
  try {
    // https://nodejs.org/docs/latest-v12.x/api/fs.html#fs_fspromises_readdir_path_options
    const fileNames = await fs.promises.readdir(directoryIn);
    for (const fileName of fileNames) {
      const img = sharp(path.join(directoryIn, fileName));

      // https://sharp.pixelplumbing.com/api-input
      const meta = await img.metadata();
      const isHorizontal = meta.width > meta.height;

      if (
        (isHorizontal && meta.width > widthCeiling) ||
        (!isHorizontal && meta.height > heightCeiling)
      ) {
        const newFilePath =
          path.join(
            directorOut,
            getFileNameWithoutExt(fileName),
            resizedFileSuffix
          ) + getFileExtWithDot(fileName);

        // https://sharp.pixelplumbing.com/api-resize
        await img
          .resize({
            width: isHorizontal ? widthCeiling : null,
            height: !isHorizontal ? heightCeiling : null,
            fit: 'contain'
          })
          .toFile(newFilePath);

        console.log('Resized:', newFilePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

batchImageResize();
