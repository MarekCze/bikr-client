import React from 'react';
import { YStack, Text, Stack, Button, XStack, Progress } from 'tamagui';
import { PollCardProps } from './MediaCardTypes';

export default function PollCard({ question, options, userVotedOptionId, onVote }: PollCardProps) {
  // Calculate total votes for percentage
  const totalVotes = options.reduce((sum, option) => sum + (option.vote_count || 0), 0);
  
  // Check if user has already voted
  const hasVoted = !!userVotedOptionId;
  
  // Function to handle voting on an option
  const handleVote = (optionId: string) => {
    if (!hasVoted && onVote) {
      onVote(optionId);
    }
  };
  
  return (
    <YStack space="$4">
      {/* Poll question */}
      <Text fontWeight="bold" fontSize="$5">
        {question}
      </Text>
      
      {/* Poll options */}
      <YStack space="$2">
        {options.map((option) => {
          const voteCount = option.vote_count || 0;
          const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isSelected = option.id === userVotedOptionId;
          
          return (
            <Stack 
              key={option.id} 
              borderRadius="$2"
              borderColor={isSelected ? '$primary' : '$borderColor'}
              borderWidth={isSelected ? 2 : 1}
              padding="$3"
              backgroundColor={isSelected ? '$backgroundHover' : undefined}
              {...(!hasVoted ? { onPress: () => handleVote(option.id) } : {})}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text>{option.text}</Text>
                {hasVoted && (
                  <Text fontSize="$2" color="$gray11">
                    {voteCount} {voteCount === 1 ? 'vote' : 'votes'} • {votePercentage.toFixed(0)}%
                  </Text>
                )}
              </XStack>
              
              {/* Show progress bar for results when user has voted */}
              {hasVoted && (
                <Progress 
                  marginTop="$2"
                  value={votePercentage} 
                  max={100}
                >
                  <Progress.Indicator backgroundColor="$primary" />
                </Progress>
              )}
            </Stack>
          );
        })}
      </YStack>
      
      {/* Footer info */}
      <Text fontSize="$2" color="$gray11" textAlign="right">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
      </Text>
    </YStack>
  );
}
