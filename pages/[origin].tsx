import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../api";
import type { Trip } from "../types";

type Props = {
  trips: Trip[];
};

type Params = ParsedUrlQuery & {
  origin: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const trips = await api.trips.list(params?.origin!?.toUpperCase());

  trips.sort((a, b) => a.ratio - b.ratio);

  return {
    props: {
      trips: trips.slice(0, 100),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const OriginPage: React.FC<Props> = ({ trips }) => {
  const [sort, setSort] = useState<"price" | "days">("price");
  const [limit, setLimit] = useState<number>(15);

  const matches = useMemo(() => {
    const draft = [...trips];

    return draft.sort((a, b) => a[sort] - b[sort]).slice(0, limit);
  }, [sort, trips, limit]);

  const checkpoint = useRef<HTMLDivElement>(null);

  // Logic for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         setLimit((limit) => limit + 10);
//       }
//     });

//     if (checkpoint.current) observer.observe(checkpoint.current);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

  return (
    <div className=" px-56">
      <div className="flex items-center justify-center gap-4  my-10">
        <p>Ordenar por:</p>
        <button
          onClick={() => setSort("days")}
          className={`px-4 py-2 rounded-lg border border-slate-500 ${
            sort === "days" && "border-yellow-400"
          }`}
        >
          Días
        </button>
        <button
          onClick={() => setSort("price")}
          className={`px-4 py-2 rounded-lg border border-slate-500 ${
            sort === "price" && "border-yellow-400"
          }`}
        >
          Precio
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {matches.map((trip) => (
          <Link key={trip.id} href={`/${trip.id}`}>
            <div className="flex flex-col  border border-slate-400 rounded-xl p-4 hover:border-yellow-500">
              <p className="text-xs mb-2">DESTINO</p>
              <h3 className="text-2xl font-semibold mb-4">
                {trip.origin.destination}
              </h3>
              <p className="lg  mb-4">Días: {trip.days}</p>
              <p className="lg  mb-4">Ratio: {trip.ratio}</p>
              <h4 className="text-2xl  mb-4">
                {Number(trip.price).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </h4>
              <ArrowRightIcon width={24} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10 mb-40">
        {trips.length > limit && (
          <button
            onClick={() => setLimit((limit) => limit + 10)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
          >
            Cargar más
          </button>
        )}
        <div ref={checkpoint} />
      </div>
    </div>
  );
};

export default OriginPage;
