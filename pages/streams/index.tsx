import Bottombtn from "@/components/bottombtn";
import Layout from "@/components/layout";
import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// 필요없는 기능이므로 navbar를 통해 접근 할 수 없도록 하였음

interface StreamRes {
    ok: boolean;
    streams: Stream[];
}

const Streams: NextPage = () => {
    const { data } = useSWR<StreamRes>(`/api/streams`);
    return (
        <Layout seotitle={"Stream"} hasTabBar title="라이브">
            <div className="py-10 px-4 space-y-10">
                {data?.streams.map((stream) => (
                    <Link key={stream.id} href={`/streams/${stream.id}`} legacyBehavior>
                        <div className="px-4">
                            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video " />
                            <h3 className="font-bold text-gray-800 text-lg mt-2">{stream.name}</h3>
                        </div>
                    </Link>
                ))}
                <Bottombtn href="/streams/upload">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </Bottombtn>
            </div>
        </Layout>
    )
}

export default Streams;