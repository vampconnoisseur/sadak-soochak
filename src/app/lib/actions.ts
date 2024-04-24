"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function insertReport(prevState: any, formData: FormData) {
  const rawFormData = {
    location: formData.get("location"),
    description: formData.get("description"),
    date: formData.get("date"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    severity: formData.get("severity"),
    feedback: formData.get("feedback"),
    imageurl: formData.get("imageURL"),
  };

  const FormDataSchema = z.object({
    location: z.string(),
    description: z.string(),
    date: z.string(),
    contactName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    severity: z.string(),
    feedback: z.string().optional(),
    imageurl: z.string(),
  });

  try {
    const validatedData = FormDataSchema.parse(rawFormData);

    if (!validatedData.imageurl) {
      throw new Error("Image URL is required.");
    }

    await sql`
      INSERT INTO reports (location, description, date, contact_name, email, phone, severity, feedback, imageurl)
      VALUES (${validatedData.location}, ${validatedData.description}, ${validatedData.date},
              ${validatedData.contactName}, ${validatedData.email}, ${validatedData.phone},
              ${validatedData.severity}, ${validatedData.feedback}, ${validatedData.imageurl})
    `;

    revalidatePath("/grievances");
    return { message: "Report submitted successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Failed to submit report." };
  }
}
