# Settings Route Group

This document describes the new settings functionality added to the Expo app.

## Overview

The settings route group provides a comprehensive settings interface for users to manage their profile, password, and subscription settings.

## Structure

```
app/(settings)/
├── _layout.tsx          # Settings navigation layout
├── index.tsx            # Main settings page
├── profile.tsx          # Profile settings page
├── password.tsx         # Change password page
└── subscription.tsx     # Subscription management page
```

## Features

### 1. Main Settings Page (`index.tsx`)
- User profile overview with avatar, name, email, and plan
- Navigation to different settings sections
- Logout functionality
- Clean, modern UI with NativeWind styling

### 2. Profile Settings (`profile.tsx`)
- Edit user name, username, and email
- Form validation and error handling
- Real-time save button state
- Profile picture placeholder (ready for future implementation)

### 3. Change Password (`password.tsx`)
- Current password verification
- New password with confirmation
- Password strength requirements
- Show/hide password toggles
- Comprehensive validation

### 4. Subscription Management (`subscription.tsx`)
- Current plan display with features
- Usage statistics (followers, credits)
- Plan upgrade/downgrade options
- Subscription cancellation
- Billing information

## API Integration

The settings use the following API endpoints:

- **GET** `/user` - Fetch user data
- **POST** `/user` - Update user data (profile, password)

## Navigation

### Accessing Settings
1. **Tab Navigation**: Settings tab in the main tab bar
2. **Direct Navigation**: Settings button on the home page
3. **Route**: `/(settings)` route group

### Navigation Flow
```
Home → Settings Tab → Settings Route Group
├── Profile Settings
├── Change Password
└── Subscription
```

## Styling

- **NativeWind**: Tailwind CSS classes for consistent styling
- **clsx**: Conditional class names for dynamic styling
- **Color Scheme**: Uses the app's defined color palette
- **Responsive Design**: Adapts to different screen sizes

## Dependencies

- `axios` - HTTP client for API calls
- `clsx` - Conditional class name utility
- `nativewind` - Tailwind CSS for React Native
- `expo-router` - Navigation and routing
- `lucide-react-native` - Icon library
- `react-native-safe-area-context` - Safe area handling

## Future Enhancements

- Profile picture upload and management
- Two-factor authentication
- Notification preferences
- Privacy settings
- Data export functionality
- Payment method management

## Usage Examples

### Navigate to Settings
```typescript
import { router } from 'expo-router';

// Navigate to main settings
router.push('/(settings)');

// Navigate to specific setting
router.push('/(settings)/profile');
router.push('/(settings)/password');
router.push('/(settings)/subscription');
```

### API Calls
```typescript
import axios from 'axios';

// Fetch user data
const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`);

// Update user profile
await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
  name: 'New Name',
  username: 'newusername',
  email: 'newemail@example.com'
});

// Change password
await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
  currentPassword: 'oldpassword',
  newPassword: 'newpassword'
});
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Validation errors
- Server errors
- User-friendly error messages

## Security Features

- Current password verification for sensitive changes
- Secure password input fields
- Form validation
- API endpoint protection (assumed)

## Testing

To test the settings functionality:

1. Navigate to the settings tab
2. Test each settings page
3. Verify API calls work correctly
4. Test form validation
5. Verify navigation between pages
6. Test error scenarios

## Notes

- The settings route group is integrated into the main app layout
- All styling uses the existing design system
- API endpoints match the existing backend structure
- The implementation follows React Native and Expo best practices
