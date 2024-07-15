import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { useEffect, useState } from "react";
import { applyQuery } from "@/lib/applyQuery";
import { dummyData, fields } from "@/lib/dummydata";
import { Data, Query } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function Home() {
  const [query, setQuery] = useState({
    combinator: "and",
    rules: [],
  });

  const [filteredData, setFilteredData] = useState(dummyData);

  const handleQueryChange = (newQuery: Query) => {
    setQuery(newQuery);
    const filtered = applyQuery(dummyData, newQuery);
    setFilteredData(filtered);
  };

  return (
    <main
      className={`flex min-h-screen flex-col gap-10 p-10 ${inter.className}`}
    >
      <div className="min-h-52 rounded-xl border-[1px] shadow-lg">
        <p className="pl-3 pt-3">Query</p>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={handleQueryChange}
        />
      </div>
      <Table>
        <TableCaption>
          {filteredData.length ? "Filtered Data" : "No Data"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item: Data, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium flex flex-row gap-2 items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={item.avatar}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="rounded-full"
                  />
                  <AvatarFallback>
                    {item.firstName[0]}
                    {item.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {item.firstName} {item.lastName}
              </TableCell>
              <TableCell>{item.age}</TableCell>
              <TableCell>{item.birthdate.toISOString().slice(0, 10)}</TableCell>
              <TableCell className="">{item.region}</TableCell>
              <TableCell className="">{item.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
