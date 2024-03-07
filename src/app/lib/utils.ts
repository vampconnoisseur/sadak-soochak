export const uploadToCloudinary = async (
  e: React.ChangeEvent<HTMLInputElement>,
  addImage: (imageUrl: string) => void
) => {
  const file: File | undefined = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      addImage(data.secure_url);

      return data.secure_url;
    } else {
      throw new Error("Error uploading image to Cloudinary");
    }
  } catch (error) {
    throw error;
  }
};
