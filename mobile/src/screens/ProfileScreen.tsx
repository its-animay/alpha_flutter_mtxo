import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/auth/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();

  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: '',
    notificationsEnabled: true,
    darkModeEnabled: isDark,
  });

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const profileData = await apiRequest(API_ENDPOINTS.USERS.GET_PROFILE);
        
        setFormData({
          fullName: profileData.fullName || user.fullName || '',
          email: profileData.email || user.email || '',
          bio: profileData.bio || '',
          notificationsEnabled: profileData.preferences?.notifications?.enabled ?? true,
          darkModeEnabled: isDark,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // Handle form input changes
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      if (!formData.fullName.trim()) {
        Alert.alert('Error', 'Name cannot be empty');
        setIsSaving(false);
        return;
      }

      // Update profile on server
      await apiRequest(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        'PUT',
        {
          fullName: formData.fullName,
          bio: formData.bio,
          preferences: {
            notifications: {
              enabled: formData.notificationsEnabled
            }
          }
        }
      );

      // If theme changed, update it
      if (formData.darkModeEnabled !== isDark) {
        toggleTheme();
      }

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: user?.profilePicture || 
                  'https://placehold.co/200x200/1a202c/e2e8f0?text=User'
              }}
              style={styles.profileImage}
            />
            
            {isEditing && (
              <TouchableOpacity 
                style={[styles.editImageButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.editImageButtonText}>Update</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {!isEditing ? (
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {user?.fullName}
              </Text>
              <Text style={[styles.profileUsername, { color: theme.gray[500] }]}>
                @{user?.username}
              </Text>
              {formData.bio ? (
                <Text style={[styles.profileBio, { color: theme.text }]}>
                  {formData.bio}
                </Text>
              ) : (
                <Text style={[styles.profileBio, { color: theme.gray[500], fontStyle: 'italic' }]}>
                  No bio added yet
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.gray[500]}
                  value={formData.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                      color: theme.gray[500],
                      borderColor: theme.border
                    }
                  ]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.gray[500]}
                  value={formData.email}
                  editable={false}
                />
                <Text style={[styles.helperText, { color: theme.gray[500] }]}>
                  Email cannot be changed
                </Text>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Bio</Text>
                <TextInput
                  style={[
                    styles.textAreaInput,
                    { 
                      backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  placeholder="Tell us about yourself"
                  placeholderTextColor={theme.gray[500]}
                  value={formData.bio}
                  onChangeText={(text) => handleChange('bio', text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            {!isEditing ? (
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.primary }]}
                onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActionButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton, 
                    { borderColor: theme.gray[500] }
                  ]}
                  onPress={() => setIsEditing(false)}>
                  <Text style={[styles.cancelButtonText, { color: theme.gray[500] }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.saveButton, 
                    { backgroundColor: theme.primary }
                  ]}
                  onPress={handleSaveProfile}
                  disabled={isSaving}>
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
          
          <View 
            style={[
              styles.settingItem, 
              { borderBottomColor: isDark ? theme.gray[800] : theme.gray[200] }
            ]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={formData.darkModeEnabled}
              onValueChange={(value) => handleChange('darkModeEnabled', value)}
              trackColor={{ false: theme.gray[300], true: theme.primary }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View 
            style={[
              styles.settingItem, 
              { borderBottomColor: isDark ? theme.gray[800] : theme.gray[200] }
            ]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Notifications
            </Text>
            <Switch
              value={formData.notificationsEnabled}
              onValueChange={(value) => handleChange('notificationsEnabled', value)}
              trackColor={{ false: theme.gray[300], true: theme.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
        
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.danger }]}
            onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.gray[500] }]}>
            MTXO Labs v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editImageButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textAreaInput: {
    minHeight: 100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    width: '100%',
  },
  editButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
  },
});

export default ProfileScreen;