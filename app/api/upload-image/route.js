import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64File}`;

    const uploadOptions = {
      folder: 'my_uploads',
    };

    // Aplicamos transformaciones específicas según el tipo de imagen
    if (type === 'cover') {
      uploadOptions.transformation = [
        { width: 1200, height: 800, crop: "fit" },
        { aspect_ratio: "3:2", crop: "crop", gravity: "auto", height: 800 },
        { quality: "auto:best", fetch_format: "auto" }
      ];
    } else if (type === 'logo') {
      uploadOptions.transformation = [
        { width: 200, height: 200, crop: "fit" },
        { aspect_ratio: "1:1", crop: "crop", gravity: "auto", height: 200 },
        { quality: "auto:best", fetch_format: "auto" }
      ];
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    console.log('Cloudinary upload result:', result);

    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error uploading image' }), { status: 500 });
  }
}
