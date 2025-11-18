import React from 'react';
import { Image, ImageProps } from 'react-native';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSource: any;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ source, fallbackSource, ...props }) => {
  const [error, setError] = React.useState(false);

  return (
    <Image
      {...props}
      source={error ? fallbackSource : source}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;