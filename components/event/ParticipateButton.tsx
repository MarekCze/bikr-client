import React, { useState, useEffect } from 'react';
import { Button, XStack, Spinner, Sheet, YStack, Text } from 'tamagui';
import { Check, ChevronDown, Calendar, HelpCircle, X } from '@tamagui/lucide-icons';
import { useEvent } from '../../contexts/EventContext';
import { ParticipationStatus, UUID } from '@bikr/shared/src/types/event';

interface ParticipateButtonProps {
  eventId: UUID;
  initialStatus?: ParticipationStatus | null;
  onStatusChange?: (status: ParticipationStatus | null) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ParticipateButton: React.FC<ParticipateButtonProps> = ({
  eventId,
  initialStatus = null,
  onStatusChange,
  fullWidth = true,
  size = 'medium',
}) => {
  const { joinEvent, leaveEvent } = useEvent();
  const [loading, setLoading] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<ParticipationStatus | null>(initialStatus);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Update internal state when prop changes
  useEffect(() => {
    setParticipationStatus(initialStatus);
  }, [initialStatus]);

  // Get button properties based on status
  const getButtonProperties = () => {
    if (!participationStatus) {
      return {
        label: 'Join Event',
        theme: 'blue',
        icon: <Calendar size={16} />,
      };
    }

    switch (participationStatus) {
      case ParticipationStatus.GOING:
        return {
          label: 'Going',
          theme: 'green',
          icon: <Check size={16} />,
        };
      case ParticipationStatus.INTERESTED:
        return {
          label: 'Interested',
          theme: 'yellow',
          icon: <HelpCircle size={16} />,
        };
      case ParticipationStatus.NOT_GOING:
        return {
          label: 'Not Going',
          theme: 'red',
          icon: <X size={16} />,
        };
      default:
        return {
          label: 'Join Event',
          theme: 'blue',
          icon: <Calendar size={16} />,
        };
    }
  };

  // Size mapping
  const sizeMapping = {
    small: '$2',
    medium: '$3',
    large: '$4',
  };

  const buttonSize = sizeMapping[size] || '$3';

  // Handle participation status change
  const handleStatusChange = async (status: ParticipationStatus | null) => {
    try {
      setLoading(true);
      
      if (status === null && participationStatus !== null) {
        // Leave the event
        await leaveEvent(eventId);
      } else if (status !== null && participationStatus === null) {
        // Join the event
        await joinEvent(eventId, status);
      } else if (status !== null && participationStatus !== null) {
        // Update status from one to another
        await leaveEvent(eventId); // Leave first
        await joinEvent(eventId, status); // Then join with new status
      }
      
      setParticipationStatus(status);
      
      if (onStatusChange) {
        onStatusChange(status);
      }
    } catch (error) {
      console.error('Error updating participation status:', error);
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  };

  const buttonProps = getButtonProperties();
  
  return (
    <XStack width={fullWidth ? '100%' : 'auto'}>
      <Button
        flex={1}
        theme={buttonProps.theme as any}
        size={buttonSize}
        icon={buttonProps.icon}
        disabled={loading}
        onPress={() => {
          // If not participating, join with GOING status
          // If already participating, show options
          if (!participationStatus) {
            handleStatusChange(ParticipationStatus.GOING);
          } else {
            setSheetOpen(true);
          }
        }}
      >
        {loading ? <Spinner /> : buttonProps.label}
      </Button>
      
      {participationStatus !== null && (
        <>
          <Button
            size={buttonSize}
            theme={buttonProps.theme as any}
            icon={<ChevronDown size={16} />}
            disabled={loading}
            onPress={() => setSheetOpen(true)}
          />
          
          <Sheet
            modal
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            snapPoints={[30]}
            dismissOnSnapToBottom
          >
            <Sheet.Overlay />
            <Sheet.Frame>
              <YStack padding="$4" space="$3">
                <Text fontSize={18} fontWeight="bold">Update Participation Status</Text>
                
                <Button 
                  icon={<Check size={16} />}
                  onPress={() => handleStatusChange(ParticipationStatus.GOING)}
                  theme="green"
                  marginVertical="$1"
                >
                  Going
                  {participationStatus === ParticipationStatus.GOING && (
                    <Check size={16} />
                  )}
                </Button>
                
                <Button 
                  icon={<HelpCircle size={16} />}
                  onPress={() => handleStatusChange(ParticipationStatus.INTERESTED)}
                  theme="yellow"
                  marginVertical="$1"
                >
                  Interested
                  {participationStatus === ParticipationStatus.INTERESTED && (
                    <Check size={16} />
                  )}
                </Button>
                
                <Button 
                  icon={<X size={16} />}
                  onPress={() => handleStatusChange(ParticipationStatus.NOT_GOING)}
                  theme="red"
                  marginVertical="$1"
                >
                  Not Going
                  {participationStatus === ParticipationStatus.NOT_GOING && (
                    <Check size={16} />
                  )}
                </Button>
                
                <Button 
                  onPress={() => handleStatusChange(null)}
                  theme="gray"
                  marginTop="$2"
                >
                  Leave Event
                </Button>
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </>
      )}
    </XStack>
  );
};
