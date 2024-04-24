import Image from "next/image";
import { fetchReports } from "../lib/data";
import Link from "next/link";

const PAGE = async () => {
  try {
    const allReports = await fetchReports();

    if (allReports.length === 0) {
      return (
        <div className="flex flex-col min-h-screen justify-center items-center">
          <h1 className="mb-8 text-lg">No Reports Found.</h1>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen justify-center items-center mb-16">
        <h1 className="mt-20 mb-20 text-5xl font-bold">All Reports</h1>
        <div className="grid grid-cols-3 gap-8 text-black mb-10">
          {allReports.map((report) => (
            <div key={report.id} className="flex justify-center items-center">
              <div className="bg-white p-2 rounded-3xl ">
                <Link href={`/grievances/${report.id}`}>
                  <Image
                    src={report.imageurl}
                    width={300}
                    height={300}
                    alt="a"
                    className="rounded-3xl"
                  ></Image>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching reports:", error);

    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <h1>Error Fetching Reports.</h1>
        <p>Please try again later.</p>
      </div>
    );
  }
};

export default PAGE;
