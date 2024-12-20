import Toast from 'react-native-toast-message';

// Function to show Toast notification
 const showToast = (type, text1, text2 , text1color) => {
  // Define the styles and message based on the type
  const toastConfig = {
    success: {
      type: 'success',
      position: 'top',
      text1: text1 ,
      text2: text2 ,
      visibilityTime: 3000,
      autoHide: true,
      style: {
        backgroundColor: 'white',
        borderLeftWidth: 5,
        borderLeftColor: 'green',
        borderRadius: 8,
      },
      text1Style: {
        color: text1color,
        fontSize: 10,
        fontWeight: 'normal',
      },
      text2Style: {
        color: '#333',
        fontSize: 12,
        fontWeight: 'normal',
      }
    },
    error: {
      type: 'error',
      position: 'top',
      text1: text1 ,
      text2: text2 ,
      visibilityTime: 3000,
      autoHide: true,
      style: {
        backgroundColor: 'white',
        borderLeftWidth: 5,
        borderLeftColor: 'red',
        borderRadius: 8,
        
      },
      text1Style: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
        
      },
      text2Style: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'normal',
      }
    }
  };

  // Call the Toast based on the type (success or error)
  Toast.show(toastConfig[type]);
};
export default showToast;
