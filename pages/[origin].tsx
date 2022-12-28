import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import React from "react";
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
  console.log(trips);

  return (
    <div className="grid grid-cols-2 gap-6 px-56">
      {trips.map((trip) => (
        <Link  key={trip.id} href={`/${trip.id}`}>
          <div className="flex flex-col  border border-slate-400 rounded-xl p-4 hover:border-yellow-500">
            <p className="text-xs mb-2">DESTINO</p>
            <h3 className="text-2xl font-semibold mb-4">
              {trip.origin.destination}
            </h3>
            <p className="lg  mb-4">Días: {trip.days}</p>
            <p className="lg  mb-4">Ratio: {trip.ratio}</p>
            <h4 className="text-2xl  mb-4">${Number(trip.price).toLocaleString('es-AR')}</h4>
            <ArrowRightIcon width={24} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OriginPage;
