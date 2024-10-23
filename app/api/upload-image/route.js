import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

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
    const transformation = formData.get('transformation');

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    // Convertir el archivo a un buffer
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    // Configurar las opciones de carga
    const uploadOptions = {
      folder: type,
    };

    // Aplicar la transformación si se proporciona
    if (transformation) {
      uploadOptions.transformation = transformation.split('/').map(t => {
        const [key, value] = t.split(',');
        return { [key]: value };
      });
    }

    // Subir la imagen a Cloudinary con las opciones configuradas
    const result = await cloudinary.uploader.upload(fileUri, uploadOptions);

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
