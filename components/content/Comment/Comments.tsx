import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, YStack, XStack, Text, Sheet } from 'tamagui';
import { CommentList } from './CommentList';

interface CommentsProps {
  postId: string;
  commentCount: number;
  initialExpanded?: boolean;
}

/**
 * Comments component that provides a button to show/hide comments
 * for any post. When expanded, it will fetch and display comments.
 */
export function Comments({ postId, commentCount, initialExpanded = false }: CommentsProps) {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(initialExpanded);
  
  return (
    <>
      <Button
        chromeless
        size="$3"
        onPress={() => setOpen(true)}
        pressStyle={{ scale: 0.95 }}
        paddingHorizontal="$1"
      >
        <Text fontSize="$2">💬 {commentCount > 0 ? commentCount : ''}</Text>
      </Button>
      
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[90]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <YStack padding="$3">
            <XStack marginBottom="$4" justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="$5">Comments</Text>
              <Button size="$3" circular onPress={() => setOpen(false)}>
                <Text fontSize="$5">&times;</Text>
              </Button>
            </XStack>
            
            <CommentList 
              postId={postId}
              initialTotalCount={commentCount}
            />
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8
  }
});
