import React, { useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Club, ClubPrivacy, CreateClubInput, UpdateClubInput } from 'bikr-shared';
import { CreateClubSchema, UpdateClubSchema } from 'bikr-shared';
import { Button, Form, Input, Spinner, Text, TextArea, YStack, XStack, RadioGroup, Separator, Stack } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'tamagui';
import { Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ClubSettingsFormProps {
  club?: Club; // If provided, we're editing an existing club
  onSubmit: (data: any) => Promise<void>; // Use 'any' to avoid type conflicts
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ClubSettingsForm({
  club,
  onSubmit,
  onCancel,
  isSubmitting
}: ClubSettingsFormProps) {
  const isEditing = !!club;
  
  // Track locally selected images (not yet uploaded)
  const [avatarImage, setAvatarImage] = useState<string | null>(club?.avatar_url || null);
  const [bannerImage, setBannerImage] = useState<string | null>(club?.banner_url || null);

  // Use appropriate schema based on whether we're creating or editing
  const formSchema = isEditing ? UpdateClubSchema : CreateClubSchema;
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateClubInput | UpdateClubInput>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing 
      ? {
          name: club.name,
          description: club.description || '',
          privacy: club.privacy,
          avatar_url: club.avatar_url || '',
          banner_url: club.banner_url || ''
        }
      : {
          name: '',
          description: '',
          privacy: ClubPrivacy.PUBLIC,
          avatar_url: '',
          banner_url: ''
        }
  });

  // Watch privacy value to dynamically show relevant instructions
  const privacyValue = watch('privacy');

  // Handle image selection for avatar
  const handleSelectAvatar = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setAvatarImage(uri);
        setValue('avatar_url', uri); // This will need to be uploaded later
      }
    } catch (error) {
      console.error('Error selecting avatar image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  }, [setValue]);

  // Handle image selection for banner
  const handleSelectBanner = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Banner aspect ratio
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setBannerImage(uri);
        setValue('banner_url', uri); // This will need to be uploaded later
      }
    } catch (error) {
      console.error('Error selecting banner image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  }, [setValue]);

  // Handle form submission
  const handleFormSubmit = async (data: CreateClubInput | UpdateClubInput) => {
    // Images will need to be uploaded to storage first in the parent component
    // before calling the API with the storage URLs
    await onSubmit(data);
  };

  return (
    <YStack space="$4" paddingHorizontal="$2">
      <Text fontSize="$6" fontWeight="bold">
        {isEditing ? 'Edit Club Details' : 'Create New Club'}
      </Text>
      
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Banner Image Selection */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$3" fontWeight="bold">Club Banner</Text>
          {bannerImage ? (
            <Stack position="relative">
              <Image
                source={{ uri: bannerImage }}
                style={{ width: '100%', height: 150, borderRadius: 8 }}
                resizeMode="cover"
              />
              <Button
                position="absolute"
                top={8}
                right={8}
                size="$2"
                circular
                icon={<FontAwesome name="pencil" size={16} color="#FFF" />}
                onPress={handleSelectBanner}
              />
            </Stack>
          ) : (
            <Button 
              onPress={handleSelectBanner}
              icon={<FontAwesome name="picture-o" size={20} color="#888" />}
              theme="gray"
              height={150}
              borderRadius={8}
              borderWidth={1}
              borderStyle="dashed"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="$gray10" marginLeft="$2">Add Banner Image</Text>
            </Button>
          )}
        </YStack>

        {/* Avatar Image Selection */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$3" fontWeight="bold">Club Avatar</Text>
          {avatarImage ? (
            <XStack alignItems="center" space="$4">
              <Image
                source={{ uri: avatarImage }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode="cover"
              />
              <Button
                size="$3"
                theme="gray"
                icon={<FontAwesome name="pencil" size={16} />}
                onPress={handleSelectAvatar}
              >
                Change
              </Button>
            </XStack>
          ) : (
            <Button 
              onPress={handleSelectAvatar}
              icon={<FontAwesome name="user-circle" size={20} color="#888" />}
              theme="gray"
              width={100}
              height={100}
              borderRadius={50}
              borderWidth={1}
              borderStyle="dashed"
              justifyContent="center"
              alignItems="center"
            />
          )}
        </YStack>

        <Separator marginVertical="$4" />

        {/* Club Name */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$3" fontWeight="bold">Club Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="$4"
                placeholder="Enter club name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                borderColor={errors.name ? '$red10' : undefined}
              />
            )}
          />
          {errors.name && (
            <Text color="$red10" fontSize="$2">
              {errors.name.message}
            </Text>
          )}
        </YStack>

        {/* Club Description */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$3" fontWeight="bold">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextArea
                size="$4"
                placeholder="Describe your club, its purpose, activities, etc."
                onChangeText={onChange}
                onBlur={onBlur}
                value={value || ''}
                borderColor={errors.description ? '$red10' : undefined}
                minHeight={120}
              />
            )}
          />
          {errors.description && (
            <Text color="$red10" fontSize="$2">
              {errors.description.message}
            </Text>
          )}
        </YStack>

        {/* Privacy Settings */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$3" fontWeight="bold">Privacy Settings</Text>
          <Controller
            control={control}
            name="privacy"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                value={value}
                onValueChange={(val) => onChange(val as ClubPrivacy)}
              >
                <XStack flexWrap="wrap" gap="$4">
                  <RadioGroup.Item value={ClubPrivacy.PUBLIC} id="public">
                    <RadioGroup.Indicator />
                    <Text marginLeft="$2">Public</Text>
                  </RadioGroup.Item>
                  
                  <RadioGroup.Item value={ClubPrivacy.PRIVATE} id="private">
                    <RadioGroup.Indicator />
                    <Text marginLeft="$2">Private</Text>
                  </RadioGroup.Item>
                </XStack>
              </RadioGroup>
            )}
          />
          
          <Text fontSize="$2" color="$gray10" marginTop="$2">
            {privacyValue === ClubPrivacy.PUBLIC 
              ? 'Anyone can see and join this club without approval.'
              : 'Anyone can see this club, but members must be approved to join.'}
          </Text>
        </YStack>

        {/* Form Buttons */}
        <XStack justifyContent="space-between" marginTop="$6">
          <Button
            theme="gray"
            onPress={onCancel}
            disabled={isSubmitting}
            width="48%"
          >
            Cancel
          </Button>
          
          <Button
            theme="blue"
            onPress={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            width="48%"
            icon={isSubmitting ? () => <Spinner size="small" color="#FFF" /> : undefined}
          >
            {isEditing ? 'Save Changes' : 'Create Club'}
          </Button>
        </XStack>
      </Form>
    </YStack>
  );
}
