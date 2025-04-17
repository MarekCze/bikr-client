import React from 'react';
import { XStack, Text, Avatar, Stack } from 'tamagui';
import { UserInfoProps } from './OwnerRibbonTypes';

export default function UserInfo({ 
  userId, 
  username, 
  displayName, 
  avatarUrl, 
  isVerified = false, 
  onPress,
  testID,
}: UserInfoProps) {
  // Determine which name to display, with fallbacks
  const displayText = displayName || username || 'Anonymous User';
  
  return (
    <XStack 
      space="$2" 
      alignItems="center" 
      onPress={onPress}
      testID={testID}
    >
      {/* User Avatar */}
      <Avatar size="$3" circular>
        {avatarUrl ? (
          <Avatar.Image src={avatarUrl} />
        ) : (
          <Avatar.Fallback backgroundColor="$blue5">
            <Text color="$blue11" fontSize="$3" fontWeight="bold">
              {displayText.substring(0, 1).toUpperCase()}
            </Text>
          </Avatar.Fallback>
        )}
      </Avatar>
      
      {/* User Information */}
      <Stack>
        <XStack space="$1" alignItems="center">
          <Text fontWeight="bold" fontSize="$3" numberOfLines={1}>
            {displayText}
          </Text>
          
          {isVerified && (
            <Text fontSize="$3" color="$blue9">
              ✓
            </Text>
          )}
        </XStack>
        
        {/* Optional secondary username display if displayName is used as main text */}
        {displayName && username && (
          <Text color="$gray11" fontSize="$2" numberOfLines={1}>
            @{username}
          </Text>
        )}
      </Stack>
    </XStack>
  );
}
