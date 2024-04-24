import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { Report } from "./definitions";

export async function fetchReports(): Promise<Report[]> {
  noStore();
  try {
    const data = await sql<Report>`
      SELECT * FROM reports
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch reports.");
  }
}

export async function fetchReport(reportId: string): Promise<Report> {
  try {
    const report =
      await sql<Report>`SELECT * FROM reports WHERE id = ${reportId}`;

    return report.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch report.");
  }
}
