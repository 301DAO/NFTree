import * as React from 'react';
import { imageExtensions, videoExtensions } from '../utils/media-extensions';
import { imageMediaTypes, videoMediaTypes } from '../utils/media-types';

const MediaComponent = React.memo(
  ({ mediaType, mediaUrl }: { mediaType: string; mediaUrl: string }) => {
    if (!mediaUrl) return <></>;
    const isVideo =
      videoExtensions.find((ext) => mediaUrl && mediaUrl.endsWith(ext)) ||
      (mediaType && videoMediaTypes.includes(mediaType));
    const isImage =
      imageExtensions.find((ext) => mediaUrl && mediaUrl.endsWith(ext)) ||
      (mediaType && imageMediaTypes.includes(mediaType));
    if (isVideo)
      return <video controls src={mediaUrl} autoPlay loop className="rounded-t-lg text-center" />;
    if (isImage)
      return <img src={mediaUrl} loading="lazy" className="object-fit rounded-t-lg text-center" />;
    return <></>;
  }
);
export default MediaComponent;
