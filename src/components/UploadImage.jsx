import { Button } from "@/components/ui/button";
import { RefreshCwIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import ReactImageUploading from "react-images-uploading";

function UploadImage({ images, setImages, handleChange, maxNumber = 1 }) {
  const [localImages, setLocalImages] = useState([]);

  useEffect(() => {
    if (images) {
      setLocalImages(images);
    }
  }, [images]);

  const handleImageChange = (imageList) => {
    handleChange(imageList);
    setLocalImages(imageList);
    const urls = imageList.map((image) => image);
    setImages(urls);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <ReactImageUploading
        multiple
        value={localImages}
        onChange={handleImageChange}
        maxNumber={maxNumber}
        acceptType={["jpg", "png", "jpeg", "webp"]}
        maxFileSize={5242880} // 5MB
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image">
            <button
              type="button"
              className="text-center bg-gray-300 border-2 border-dashed border-gray-400 rounded-lg p-4 w-full"
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click o arrastra y suelta aquí
            </button>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
              {imageList.map((image, index) => {
                return (
                  <div key={index} className="relative">
                    <img src={image.data_url ?? image} alt="" />

                    <div className="absolute top-0 right-0 flex gap-1 p-1">
                      <Button
                        type={"button"}
                        className="cursor-pointer hover:scale-105 hover:bg-primary/90 hover:shadow-md transition-all duration-200 ease-in-out"
                        onClick={() => onImageUpdate(index)}
                        size="sm"
                      >
                        <RefreshCwIcon className="w-4 h-4" />
                      </Button>

                      <Button
                        type={"button"}
                        className="cursor-pointer hover:scale-105 hover:bg-primary/90 hover:shadow-md transition-all duration-200 ease-in-out"
                        onClick={() => onImageRemove(index)}
                        size="sm"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ReactImageUploading>
    </div>
  );
}

export default UploadImage;
