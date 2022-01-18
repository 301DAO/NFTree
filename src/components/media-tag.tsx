import * as React from 'react';
import { useQuery } from 'react-query';
import { fetchHeaders } from '../lib';
import { imageExtensions, videoExtensions } from '../utils/media-extensions';
import { imageMediaTypes, videoMediaTypes } from '../utils/media-types';

const isImage = (str: string) => imageExtensions.some((item) => str.endsWith(item));
const isVideo = (str: string) => videoExtensions.some((item) => str.endsWith(item));

const MediaComponent = React.memo(({ mediaUrl }: { mediaUrl: string }) => {
  if (!mediaUrl) return <></>;

  const { data: mediaType } = useQuery(mediaUrl, () => fetchHeaders({ url: mediaUrl }), {
    enabled: !!mediaUrl && !isImage(mediaUrl)
  });

  if (isImage(mediaUrl) || (!!mediaType && imageMediaTypes.includes(mediaType)))
    return (
      <img
        src={mediaUrl}
        loading="lazy"
      
        className="w-full h-full object-fit rounded-t-lg text-center"
        alt="nft media"
      />
    );
  if (isVideo(mediaUrl) || (!!mediaType && videoMediaTypes.includes(mediaType)))
    return (
      <video
        controls
        src={mediaUrl}
        autoPlay
        loop
        className="w-full h-full object-fit rounded-t-lg text-center"
      />
    );
  return <></>;
});
export default MediaComponent;
