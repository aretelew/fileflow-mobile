import React, { useState } from "react";
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  FlatList,
  Modal 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface PendingFile {
  id: string;
  name: string;
  size: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedDate: string;
  type: 'pdf' | 'image' | 'document' | 'other';
}

export default function Files() {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileForAction, setSelectedFileForAction] = useState<UploadedFile | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'northwestern_app-1.pdf',
      size: '49.12 KB',
      uploadedDate: 'May 24, 2025',
      type: 'pdf'
    },
    {
      id: '2',
      name: 'LCR_Lab_Report-1-1.pdf',
      size: '1.65 MB',
      uploadedDate: 'May 17, 2025',
      type: 'pdf'
    },
    {
      id: '3',
      name: 'Screen Shot 2025-05-13.png',
      size: '395.58 KB',
      uploadedDate: 'May 17, 2025',
      type: 'image'
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'image':
        return 'image';
      case 'document':
        return 'document';
      default:
        return 'document-outline';
    }
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*',
      });

      if (!result.canceled) {
        const newPendingFiles = result.assets.map((file, index) => ({
          id: Date.now().toString() + index,
          name: file.name,
          size: `${(file.size! / 1024).toFixed(2)} KB`,
        }));

        setPendingFiles(newPendingFiles);
        simulateUpload(newPendingFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select files');
    }
  };

  const handleSelectImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newPendingFiles = result.assets.map((asset, index) => ({
          id: Date.now().toString() + index,
          name: asset.fileName || `image_${index + 1}.jpg`,
          size: `${(asset.fileSize! / 1024).toFixed(2)} KB`,
        }));

        setPendingFiles(newPendingFiles);
        simulateUpload(newPendingFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images');
    }
  };

  const simulateUpload = (files: PendingFile[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min(prev + 5, 100);
        
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Move all files to uploaded files
            const newUploadedFiles = files.map(file => ({
              id: file.id,
              name: file.name,
              size: file.size,
              uploadedDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              type: file.name.includes('.pdf') ? 'pdf' as const : 
                    file.name.includes('.png') || file.name.includes('.jpg') || file.name.includes('.jpeg') ? 'image' as const : 'document' as const
            }));

            setUploadedFiles(prev => [...newUploadedFiles, ...prev]);
            setPendingFiles([]);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
        
        return newProgress;
      });
    }, 100);
  };

  const handleDeleteFile = (fileId: string) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
            setIsActionModalVisible(false);
            setSelectedFileForAction(null);
          }
        }
      ]
    );
  };

  const showFileActions = (file: UploadedFile) => {
    setSelectedFileForAction(file);
    setIsActionModalVisible(true);
  };

  const renderPendingFile = ({ item }: { item: PendingFile }) => (
    <View className="bg-white rounded-lg p-4 mb-2 mx-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons name="document-outline" size={20} color="#666" />
          <Text className="ml-2 text-base font-medium text-gray-800 flex-1" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text className="text-sm text-gray-500">{item.size}</Text>
      </View>
    </View>
  );

  const renderUploadedFile = ({ item }: { item: UploadedFile }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-2 mx-4 shadow-sm flex-row items-center">
      <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-3">
        <Ionicons name={getFileIcon(item.type) as any} size={20} color="#666" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {item.size} • {item.uploadedDate}
        </Text>
      </View>
      <TouchableOpacity 
        className="p-2"
        onPress={() => showFileActions(item)}
      >
        <Ionicons name="ellipsis-vertical" size={16} color="#ccc" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Get only the last 5 uploaded files
  const recentFiles = uploadedFiles.slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
          {/* <Text className="text-gray-600 mt-1">Upload, manage, and organize your files in one place.</Text> */}
        </View>

        {/* Upload Section */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Upload Files</Text>
          <TouchableOpacity 
            className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 items-center mb-4"
            activeOpacity={0.7}
          >
            <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-upload-outline" size={32} color="#3B82F6" />
            </View>
            <Text className="text-lg font-medium text-gray-900 mb-1">
              Select files to upload
            </Text>
            <Text className="text-gray-500 mb-4">Choose from files or images</Text>
            
            {/* Two buttons for different file types */}
            <View className="flex-row space-x-2">
              <TouchableOpacity 
                className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center mr-4"
                onPress={handleSelectFiles}
              >
                <Ionicons name="document-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-2">Files</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-green-500 px-6 py-3 rounded-lg flex-row items-center"
                onPress={handleSelectImages}
              >
                <Ionicons name="image-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-2">Images</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pending Files Section */}
        {pendingFiles.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3 px-4">
              Pending Files
            </Text>
            <Text className="text-gray-600 mb-3 px-4">
              Files ready to be uploaded
            </Text>
            
            {/* Unified Progress Bar */}
            {isUploading && (
              <View className="mx-4 mb-4 bg-white rounded-lg p-4 shadow-sm">
                <Text className="text-sm text-gray-600 mb-2">
                  Uploading {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''}...
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <View 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </View>
                  <Text className="text-sm text-gray-600 font-medium">{uploadProgress}%</Text>
                </View>
              </View>
            )}
            
            <FlatList
              data={pendingFiles}
              renderItem={renderPendingFile}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Recent Files Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 px-4">
            Recent Files
          </Text>
          {recentFiles.length > 0 ? (
            <FlatList
              data={recentFiles}
              renderItem={renderUploadedFile}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="mx-4 bg-white rounded-lg p-8 items-center">
              <Ionicons name="folder-outline" size={48} color="#ccc" />
              <Text className="text-gray-500 mt-2">No files uploaded yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* File Action Modal */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-xl p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <Ionicons 
                  name={selectedFileForAction ? getFileIcon(selectedFileForAction.type) as any : 'document'} 
                  size={20} 
                  color="#666" 
                />
              </View>
              <Text className="flex-1 text-lg font-medium text-gray-800" numberOfLines={1}>
                {selectedFileForAction?.name}
              </Text>
            </View>
            
            <TouchableOpacity
              className="flex-row items-center py-4 px-2"
              onPress={() => selectedFileForAction && handleDeleteFile(selectedFileForAction.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="ml-3 text-base text-red-500 font-medium">Delete File</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row items-center py-4 px-2 mt-2"
              onPress={() => setIsActionModalVisible(false)}
            >
              <Ionicons name="close-outline" size={20} color="#666" />
              <Text className="ml-3 text-base text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}