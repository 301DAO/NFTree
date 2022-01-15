import { useQuery } from "react-query";
import * as React from "react";
import { fetchHeaders } from "../lib";

export const MediaDisplay = ({ url }: { url: string }) => {
  const { data: mediaType } = useQuery([url], () => fetchHeaders({ url }), {
    enabled: !!url,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24
  });
  if (url.length === 0) return <></>;
  if (!!mediaType && mediaType === 'video/mp4') {
    return (
      <a
        href={url}
        className="border-solid border m-4 p-2 text-left no-underline"
      >
        <video src={url} autoPlay width={300} height={300} loop />
      </a>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      className="border-solid border m-4 p-2 text-left no-underline"
    >
      <img src={url} width={300} height={300} loading="lazy" />
    </a>
  );
};