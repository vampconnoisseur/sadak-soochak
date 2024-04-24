import { fetchReport } from "@/app/lib/data";
import Image from "next/image";

export default async function PAGE({ params }: { params: { id: string } }) {
  const report = await fetchReport(params.id);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center ">
      <h1 className="mb-20 text-7xl font-bold">Report Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-28">
        <div className="flex justify-center items-center">
          <div className="rounded-3xl bg-white p-2">
            <Image
              width={500}
              height={500}
              src={report.imageurl}
              alt="Report Image"
              className="rounded-3xl"
            />
          </div>
        </div>
        <div className="text-lg">
          <p className="font-semibold">Location:</p>
          <p>{report.location}</p>
          <p className="font-semibold mt-4">Description:</p>
          <p>{report.description}</p>
          <p className="font-semibold mt-4">Date:</p>
          <p>{report.date.toString()}</p>
          {report.contactName && (
            <>
              <p className="font-semibold mt-4">Contact Name:</p>
              <p>{report.contactName}</p>
            </>
          )}
          {report.email && (
            <>
              <p className="font-semibold mt-4">Email:</p>
              <p>{report.email}</p>
            </>
          )}
          {report.phone && (
            <>
              <p className="font-semibold mt-4">Phone:</p>
              <p>{report.phone}</p>
            </>
          )}
          <p className="font-semibold mt-4">Severity:</p>
          <p>{report.severity}</p>
          {report.feedback && (
            <>
              <p className="font-semibold mt-4">Feedback:</p>
              <p>{report.feedback}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
