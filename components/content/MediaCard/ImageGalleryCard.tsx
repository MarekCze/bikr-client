import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, XStack, YStack, Text, Stack } from 'tamagui';
import { ImageGalleryCardProps } from './MediaCardTypes';

export default function ImageGalleryCard({ media, onImagePress }: ImageGalleryCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Only show pagination dots if there are multiple images
  const showPagination = media.length > 1;
  
  // Handle tapping on an image
  const handleImagePress = () => {
    if (onImagePress) {
      onImagePress(activeIndex);
    }
  };
  
  // Handle swipe to change image (simplified, would use gesture handler in real implementation)
  const handleNext = () => {
    if (activeIndex < media.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  
  const activeMedia = media[activeIndex];
  
  return (
    <YStack>
      <Stack
        height={300}
        borderRadius="$2"
        overflow="hidden"
        backgroundColor="$backgroundStrong"
        position="relative"
      >
        <Stack 
          flex={1} 
          width="100%" 
          height="100%" 
          onPress={handleImagePress}
        >
          <Image
            source={{ uri: activeMedia.url }}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resizeMode="cover"
            accessibilityLabel={`Image ${activeIndex + 1} of ${media.length}`}
          />
        </Stack>
        
        {/* Left and right tap areas for gallery navigation */}
        {showPagination && (
          <>
            <Stack
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              width="33%"
              onPress={handlePrevious}
              opacity={0}
            />
            <Stack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              width="33%"
              onPress={handleNext}
              opacity={0}
            />
          </>
        )}
      </Stack>
      
      {/* Pagination dots */}
      {showPagination && (
        <XStack justifyContent="center" paddingTop="$2" space="$1">
          {media.map((_, index) => (
            <View
              key={index}
              backgroundColor={index === activeIndex ? '$primary' : '$gray9'}
              width={8}
              height={8}
              borderRadius={4}
            />
          ))}
        </XStack>
      )}
    </YStack>
  );
}
